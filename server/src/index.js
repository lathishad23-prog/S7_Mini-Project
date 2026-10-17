import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { fileURLToPath } from 'node:url';
import { connectDatabase, getObjectId, toClientRecord, ensureSeedData } from './database.js';

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
let db;
let databaseReady;

app.use(async (req, res, next) => {
  try {
    if (!databaseReady) {
      databaseReady = (async () => {
        db = await connectDatabase();
        await ensureSeedData();
      })().catch((error) => {
        databaseReady = undefined;
        throw error;
      });
    }
    await databaseReady;
    next();
  } catch (error) {
    console.error('Failed to initialize database', error);
    res.status(503).json({ message: 'Database unavailable' });
  }
});

function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
}

function authMiddleware(requiredRole) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Missing token' });
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (requiredRole && decoded.role !== requiredRole && decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

function computeHash(prevHash, data) {
  return crypto.createHash('sha256').update(prevHash + JSON.stringify(data)).digest('hex');
}

async function appendLedger(sampleId, eventType, actorId, data) {
  const lastEntry = await db.collection('custody_ledger').find({ sampleId }).sort({ _id: -1 }).limit(1).next();
  const prevHash = lastEntry ? lastEntry.hash : 'genesis';
  const timestamp = new Date().toISOString();
  const hash = computeHash(prevHash, { eventType, actorId, timestamp, data });
  await db.collection('custody_ledger').insertOne({ sampleId, eventType, actorId, timestamp, dataJson: JSON.stringify(data), prevHash, hash });
  return { timestamp, hash };
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/auth/register', async (req, res) => {
  const { name, email, password, role, dob, phone, address } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const hash = bcrypt.hashSync(password, 10);
    const userResult = await db.collection('users').insertOne({ name, email, password_hash: hash, role });
    if (role === 'patient') {
      await db.collection('patients').insertOne({ userId: userResult.insertedId, dob, phone, address });
    }
    const token = signToken({ _id: userResult.insertedId, role, email, name });
    return res.json({ token, user: { id: userResult.insertedId.toString(), role, email, name } });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  const user = await db.collection('users').findOne({ email: req.body.email });
  if (!user || !bcrypt.compareSync(req.body.password, user.password_hash)) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user._id.toString(), role: user.role, email: user.email, name: user.name } });
});

app.get('/auth/me', authMiddleware(), async (req, res) => {
  const user = await db.collection('users').findOne({ _id: getObjectId(req.user.id) });
  res.json({ user: { id: user._id.toString(), role: user.role, email: user.email, name: user.name } });
});

async function allocateTechnician(branchName) {
  const technician = await db.collection('technicians').findOneAndUpdate(
    { branch: branchName, active: true, waiting: { $lt: 5 } },
    { $inc: { waiting: 1, workload: 1 } },
    { sort: { waiting: 1, workload: 1 }, returnDocument: 'after' }
  );
  return technician.value;
}

app.post('/bookings', authMiddleware('patient'), async (req, res) => {
  const { testId, doctorName, preferredDate, collectionType, branchId, branchName } = req.body;
  const patientId = getObjectId(req.user.id);

  if (!testId || !preferredDate || !collectionType || !branchId || !branchName) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  const assignedTechnician = await allocateTechnician(branchName);
  if (!assignedTechnician) {
    return res.status(429).json({ message: 'No available technician for this branch right now. Please choose another branch or try again later.' });
  }

  const bookingResult = await db.collection('bookings').insertOne({
    patientId,
    testId: getObjectId(testId),
    doctorName,
    branchId,
    branchName,
    assignedTechnicianId: assignedTechnician._id,
    status: 'booked',
    createdAt: new Date().toISOString(),
    preferredDate,
    collectionType
  });

  const sampleCode = `LS-${String(bookingResult.insertedId.toString().slice(-4)).padStart(4, '0')}`;
  const qrPayload = JSON.stringify({ bookingId: bookingResult.insertedId.toString(), sampleCode });
  const sampleResult = await db.collection('samples').insertOne({ bookingId: bookingResult.insertedId, sampleCode, qr_payload: qrPayload, currentStatus: 'booked' });
  await appendLedger(sampleResult.insertedId, 'booked', getObjectId(req.user.id), { sampleCode, assignedTechnicianId: assignedTechnician._id.toString() });

  res.json({
    bookingId: bookingResult.insertedId.toString(),
    sampleId: sampleResult.insertedId.toString(),
    sampleCode,
    qrPayload,
    assignedTechnicianName: assignedTechnician.name,
    technicianWaiting: assignedTechnician.waiting,
    technicianWorkload: assignedTechnician.workload
  });
});

app.get('/samples', authMiddleware('technician'), async (req, res) => {
  const rows = await db.collection('samples').aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: 'bookingId',
        foreignField: '_id',
        as: 'booking'
      }
    },
    { $unwind: '$booking' },
    {
      $lookup: {
        from: 'patients',
        localField: 'booking.patientId',
        foreignField: '_id',
        as: 'patient'
      }
    },
    { $unwind: '$patient' },
    {
      $lookup: {
        from: 'users',
        localField: 'patient.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'tests',
        localField: 'booking.testId',
        foreignField: '_id',
        as: 'test'
      }
    },
    { $unwind: '$test' },
    {
      $project: {
        id: { $toString: '$_id' },
        sample_code: '$sampleCode',
        current_status: '$currentStatus',
        booking_status: '$booking.status',
        patient_id: { $toString: '$patient._id' },
        patient_name: '$user.name',
        test_name: '$test.name'
      }
    }
  ]).toArray();
  res.json(rows);
});

app.get('/samples/:id', authMiddleware('technician'), async (req, res) => {
  const sampleId = getObjectId(req.params.id);
  const sample = await db.collection('samples').aggregate([
    { $match: { _id: sampleId } },
    {
      $lookup: {
        from: 'bookings',
        localField: 'bookingId',
        foreignField: '_id',
        as: 'booking'
      }
    },
    { $unwind: '$booking' },
    {
      $lookup: {
        from: 'patients',
        localField: 'booking.patientId',
        foreignField: '_id',
        as: 'patient'
      }
    },
    { $unwind: '$patient' },
    {
      $lookup: {
        from: 'users',
        localField: 'patient.userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    {
      $lookup: {
        from: 'tests',
        localField: 'booking.testId',
        foreignField: '_id',
        as: 'test'
      }
    },
    { $unwind: '$test' },
    {
      $project: {
        id: { $toString: '$_id' },
        sampleCode: 1,
        qr_payload: 1,
        currentStatus: 1,
        booking: '$booking',
        patient: '$patient',
        patientName: '$user.name',
        testName: '$test.name'
      }
    }
  ]).next();

  if (!sample) return res.status(404).json({ message: 'Sample not found' });

  const ledger = await db.collection('custody_ledger').find({ sampleId }).sort({ _id: 1 }).toArray();
  const readings = await db.collection('sensor_readings').find({ sampleId }).sort({ _id: 1 }).toArray();
  const result = await db.collection('results').findOne({ sampleId });

  res.json({ sample, ledger, readings, result });
});

app.post('/samples/:id/advance', authMiddleware('technician'), async (req, res) => {
  const sampleId = getObjectId(req.params.id);
  const { eventType, status } = req.body;
  const sample = await db.collection('samples').findOne({ _id: sampleId });
  if (!sample) return res.status(404).json({ message: 'Sample not found' });

  await db.collection('samples').updateOne({ _id: sampleId }, { $set: { currentStatus: status } });
  await db.collection('bookings').updateOne({ _id: sample.bookingId }, { $set: { status } });
  await appendLedger(sampleId, eventType, getObjectId(req.user.id), { status });
  res.json({ ok: true });
});

app.post('/samples/:id/sensor', authMiddleware('technician'), async (req, res) => {
  const sampleId = getObjectId(req.params.id);
  const { temperature, humidity, lat, lng } = req.body;
  const anomalous = temperature > 8 || humidity > 75;
  await db.collection('sensor_readings').insertOne({ sampleId, timestamp: new Date().toISOString(), temperature, humidity, lat, lng, isAnomalous: anomalous });
  if (anomalous) {
    await db.collection('notifications').insertOne({ userId: getObjectId(req.user.id), channel: 'console', message: 'Cold chain anomaly detected', sentAt: new Date().toISOString(), isCriticalAlert: true });
  }
  res.json({ ok: true, anomalous });
});

app.post('/samples/:id/result', authMiddleware('pathologist'), async (req, res) => {
  const sampleId = getObjectId(req.params.id);
  const { testId, value } = req.body;
  const sample = await db.collection('samples').findOne({ _id: sampleId });
  const test = await db.collection('tests').findOne({ _id: getObjectId(testId) });
  if (!sample || !test) return res.status(404).json({ message: 'Sample or test not found' });

  const isAnomalous = value < test.reference_range_low || value > test.reference_range_high;
  const isCritical = value < test.critical_low || value > test.critical_high;
  const result = await db.collection('results').insertOne({ sampleId, testId: getObjectId(testId), value, isAnomalous, isCritical, validatedBy: getObjectId(req.user.id), validatedAt: new Date().toISOString() });
  if (isCritical) {
    await db.collection('notifications').insertOne({ userId: getObjectId(req.user.id), channel: 'console', message: `Critical result detected for sample ${sample.sampleCode}`, sentAt: new Date().toISOString(), isCriticalAlert: true });
  }
  res.json({ id: result.insertedId.toString(), isAnomalous, isCritical });
});

app.post('/samples/:id/verify', authMiddleware('technician'), async (req, res) => {
  const sampleId = getObjectId(req.params.id);
  const ledger = await db.collection('custody_ledger').find({ sampleId }).sort({ _id: 1 }).toArray();
  let valid = true;
  let previousHash = 'genesis';
  const issues = [];
  for (const entry of ledger) {
    const hash = computeHash(previousHash, { eventType: entry.eventType, actorId: entry.actorId, timestamp: entry.timestamp, data: JSON.parse(entry.dataJson) });
    if (hash !== entry.hash || entry.prevHash !== previousHash) {
      valid = false;
      issues.push(entry._id.toString());
    }
    previousHash = entry.hash;
  }
  res.json({ valid, issues });
});

app.get('/dashboard/summary', authMiddleware('admin'), async (req, res) => {
  const inTransit = await db.collection('samples').countDocuments({ currentStatus: 'in_transit' });
  const criticalAlerts = await db.collection('notifications').countDocuments({ isCriticalAlert: true });
  res.json({ avgTurnaround: 2.4, inTransit, criticalAlerts, integrity: 95 });
});

app.get('/me', authMiddleware('admin'), async (req, res) => {
  const user = await db.collection('users').findOne({ _id: getObjectId(req.user.id) });
  res.json({ id: user._id.toString(), role: user.role, email: user.email, name: user.name });
});

app.get('/profile', authMiddleware('technician'), async (req, res) => {
  const user = await db.collection('users').findOne({ _id: getObjectId(req.user.id) });
  res.json({ id: user._id.toString(), role: user.role, email: user.email, name: user.name });
});

async function start() {
  if (!databaseReady) {
    databaseReady = (async () => {
      db = await connectDatabase();
      await ensureSeedData();
    })();
  }
  await databaseReady;
  app.listen(3001, () => console.log('Server listening on http://localhost:3001'));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  start().catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
}

export default app;
