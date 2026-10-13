import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.MONGODB_DB || 'labsync';

const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;

export async function connectDatabase() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    await initializeSchema();
  }
  return db;
}

export function getObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  return id;
}

export function toClientRecord(document) {
  if (!document) return document;
  const { _id, ...rest } = document;
  return { id: _id.toString(), ...rest };
}

export async function initializeSchema() {
  const collections = await db.listCollections().toArray();
  const names = collections.map((item) => item.name);

  if (!names.includes('users')) {
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
  }
  if (!names.includes('patients')) {
    await db.createCollection('patients');
    await db.collection('patients').createIndex({ userId: 1 });
  }
  if (!names.includes('tests')) await db.createCollection('tests');
  if (!names.includes('technicians')) await db.createCollection('technicians');
  if (!names.includes('bookings')) await db.createCollection('bookings');
  if (!names.includes('samples')) {
    await db.createCollection('samples');
    await db.collection('samples').createIndex({ bookingId: 1 }, { unique: true });
    await db.collection('samples').createIndex({ sampleCode: 1 }, { unique: true });
  }
  if (!names.includes('custody_ledger')) {
    await db.createCollection('custody_ledger');
    await db.collection('custody_ledger').createIndex({ sampleId: 1, _id: 1 });
  }
  if (!names.includes('sensor_readings')) {
    await db.createCollection('sensor_readings');
    await db.collection('sensor_readings').createIndex({ sampleId: 1 });
  }
  if (!names.includes('results')) {
    await db.createCollection('results');
    await db.collection('results').createIndex({ sampleId: 1 }, { unique: true });
  }
  if (!names.includes('notifications')) {
    await db.createCollection('notifications');
    await db.collection('notifications').createIndex({ userId: 1 });
  }
}

export async function ensureSeedData() {
  const userCount = await db.collection('users').countDocuments();
  if (userCount > 0) return;

  const adminHash = bcrypt.hashSync('admin123', 10);
  const techHash = bcrypt.hashSync('tech123', 10);
  const pathHash = bcrypt.hashSync('path123', 10);
  const patientHash = bcrypt.hashSync('patient123', 10);

  const admin = await db.collection('users').insertOne({ name: 'Admin User', email: 'admin@labsync.ai', password_hash: adminHash, role: 'admin' });
  const tech1 = await db.collection('users').insertOne({ name: 'Nina Patel', email: 'tech1@labsync.ai', password_hash: techHash, role: 'technician' });
  const tech2 = await db.collection('users').insertOne({ name: 'Owen Scott', email: 'tech2@labsync.ai', password_hash: techHash, role: 'technician' });
  const path = await db.collection('users').insertOne({ name: 'Dr. Maya Chen', email: 'pathologist@labsync.ai', password_hash: pathHash, role: 'pathologist' });

  const patients = [
    { name: 'Asha Kumar', email: 'asha@example.com' },
    { name: 'Liam Brooks', email: 'liam@example.com' },
    { name: 'Sara Ali', email: 'sara@example.com' },
    { name: 'Noah Diaz', email: 'noah@example.com' },
    { name: 'Priya Menon', email: 'priya@example.com' }
  ];

  const patientPromises = patients.map((patient) => db.collection('users').insertOne({ ...patient, password_hash: patientHash, role: 'patient' }));
  const patientResults = await Promise.all(patientPromises);

  const patientDocs = await Promise.all(
    patientResults.map((result) =>
      db.collection('patients').insertOne({ userId: result.insertedId, dob: '1990-05-20', phone: '+1-555-0001', address: 'Seattle, WA' })
    )
  );

  const testDocs = await db.collection('tests').insertMany([
    { name: 'CBC', reference_range_low: 3.8, reference_range_high: 10.5, critical_low: 2.5, critical_high: 15.0 },
    { name: 'Lipid Panel', reference_range_low: 120, reference_range_high: 200, critical_low: 80, critical_high: 260 },
    { name: 'HbA1c', reference_range_low: 4.0, reference_range_high: 5.6, critical_low: 3.5, critical_high: 8.0 },
    { name: 'CRP', reference_range_low: 0, reference_range_high: 5, critical_low: 0, critical_high: 10 },
    { name: 'Thyroid Panel', reference_range_low: 0.4, reference_range_high: 4.0, critical_low: 0.1, critical_high: 8.0 }
  ]);

  const testIds = Object.values(testDocs.insertedIds);
  const bookingDocs = await db.collection('bookings').insertMany([
    { patientId: patientDocs[0].insertedId, testId: testIds[0], doctorName: 'Dr. Singh', status: 'in_transit', createdAt: new Date().toISOString(), preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patientDocs[1].insertedId, testId: testIds[1], doctorName: 'Dr. Alvarez', status: 'tested', createdAt: new Date().toISOString(), preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patientDocs[2].insertedId, testId: testIds[2], doctorName: 'Dr. Rivera', status: 'validated', createdAt: new Date().toISOString(), preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patientDocs[3].insertedId, testId: testIds[3], doctorName: 'Dr. Kim', status: 'delivered', createdAt: new Date().toISOString(), preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patientDocs[4].insertedId, testId: testIds[4], doctorName: 'Dr. Patel', status: 'booked', createdAt: new Date().toISOString(), preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' }
  ]);

  const bookingIds = Object.values(bookingDocs.insertedIds);
  const now = new Date().toISOString();
  const statuses = ['in_transit', 'tested', 'validated', 'delivered', 'booked'];

  for (let index = 0; index < bookingIds.length; index += 1) {
    const bookingId = bookingIds[index];
    const sampleCode = `LS-${String(index + 1).padStart(4, '0')}`;
    const qrPayload = JSON.stringify({ bookingId: bookingId.toString(), sampleCode });
    const sample = await db.collection('samples').insertOne({ bookingId, sampleCode, qr_payload: qrPayload, currentStatus: statuses[index] });

    await db.collection('custody_ledger').insertOne({ sampleId: sample.insertedId, eventType: 'booked', actorId: admin.insertedId, timestamp: now, dataJson: JSON.stringify({ status: 'booked' }), prevHash: 'genesis', hash: `hash-${sample.insertedId.toString()}-booked` });
    if (index % 2 === 0) {
      await db.collection('sensor_readings').insertOne({ sampleId: sample.insertedId, timestamp: now, temperature: 8.8, humidity: 62, lat: 47.6062, lng: -122.3321, isAnomalous: true });
    }
  }

  const sampleDocsFinal = await db.collection('samples').find().toArray();

  await db.collection('results').insertMany([
    { sampleId: sampleDocsFinal[0]._id, testId: testIds[0], value: 2.4, isAnomalous: true, isCritical: true, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocsFinal[1]._id, testId: testIds[1], value: 180, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocsFinal[2]._id, testId: testIds[2], value: 6.7, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocsFinal[3]._id, testId: testIds[3], value: 3.2, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now }
  ]);

  await db.collection('notifications').insertMany([
    { userId: patientResults[0].insertedId, channel: 'email', message: 'Your sample is in transit', sentAt: now, isCriticalAlert: false },
    { userId: path.insertedId, channel: 'sms', message: 'Critical value requires escalation', sentAt: now, isCriticalAlert: true }
  ]);
}
