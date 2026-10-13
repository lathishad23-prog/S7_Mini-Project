import { connectDatabase, getObjectId } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const db = await connectDatabase();
  await db.collection('notifications').deleteMany({});
  await db.collection('results').deleteMany({});
  await db.collection('sensor_readings').deleteMany({});
  await db.collection('custody_ledger').deleteMany({});
  await db.collection('samples').deleteMany({});
  await db.collection('bookings').deleteMany({});
  await db.collection('technicians').deleteMany({});
  await db.collection('patients').deleteMany({});
  await db.collection('tests').deleteMany({});
  await db.collection('users').deleteMany({});

  const now = new Date().toISOString();
  const adminHash = bcrypt.hashSync('admin123', 10);
  const techHash = bcrypt.hashSync('tech123', 10);
  const pathHash = bcrypt.hashSync('path123', 10);
  const patientHash = bcrypt.hashSync('patient123', 10);

  const admin = await db.collection('users').insertOne({ name: 'Admin User', email: 'admin@labsync.ai', password_hash: adminHash, role: 'admin' });
  const tech1 = await db.collection('users').insertOne({ name: 'Nina Patel', email: 'tech1@labsync.ai', password_hash: techHash, role: 'technician' });
  const tech2 = await db.collection('users').insertOne({ name: 'Owen Scott', email: 'tech2@labsync.ai', password_hash: techHash, role: 'technician' });
  const tech3 = await db.collection('users').insertOne({ name: 'Amit Singh', email: 'tech3@labsync.ai', password_hash: techHash, role: 'technician' });
  const tech4 = await db.collection('users').insertOne({ name: 'Priya Desai', email: 'tech4@labsync.ai', password_hash: techHash, role: 'technician' });
  const path = await db.collection('users').insertOne({ name: 'Dr. Maya Chen', email: 'pathologist@labsync.ai', password_hash: pathHash, role: 'pathologist' });

  await db.collection('technicians').insertMany([
    { userId: tech1.insertedId, name: 'Nina Patel', branch: 'North Diagnostic Center', active: true, onDuty: true, workload: 5, waiting: 2, shift: 'Morning' },
    { userId: tech2.insertedId, name: 'Owen Scott', branch: 'West End Lab', active: true, onDuty: true, workload: 6, waiting: 4, shift: 'Evening' },
    { userId: tech3.insertedId, name: 'Ajay Patel', branch: 'Central Clinical Lab', active: true, onDuty: true, workload: 3, waiting: 1, shift: 'Night' },
    { userId: tech4.insertedId, name: 'Sneha Joshi', branch: 'East Side Diagnostics', active: true, onDuty: true, workload: 4, waiting: 2, shift: 'Morning' }
  ]);

  const patientUsers = [
    { name: 'Asha Kumar', email: 'asha@example.com' },
    { name: 'Liam Brooks', email: 'liam@example.com' },
    { name: 'Sara Ali', email: 'sara@example.com' },
    { name: 'Noah Diaz', email: 'noah@example.com' },
    { name: 'Priya Menon', email: 'priya@example.com' }
  ];

  const patientResults = await Promise.all(
    patientUsers.map((patient) =>
      db.collection('users').insertOne({ ...patient, password_hash: patientHash, role: 'patient' })
    )
  );

  const patients = await Promise.all(
    patientResults.map((result) =>
      db.collection('patients').insertOne({ userId: result.insertedId, dob: '1990-05-20', phone: '+1-555-0001', address: 'Seattle, WA' })
    )
  );

  const tests = await db.collection('tests').insertMany([
    { _id: 't1', name: 'CBC', reference_range_low: 3.8, reference_range_high: 10.5, critical_low: 2.5, critical_high: 15.0 },
    { _id: 't2', name: 'Lipid Panel', reference_range_low: 120, reference_range_high: 200, critical_low: 80, critical_high: 260 },
    { _id: 't3', name: 'Thyroid Panel', reference_range_low: 0.4, reference_range_high: 4.0, critical_low: 0.1, critical_high: 8.0 }
  ]);

  const bookingDocs = await db.collection('bookings').insertMany([
    { patientId: patients[0].insertedId, testId: tests.insertedIds['0'], doctorName: 'Dr. Singh', status: 'in_transit', createdAt: now, preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patients[1].insertedId, testId: tests.insertedIds['1'], doctorName: 'Dr. Alvarez', status: 'tested', createdAt: now, preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patients[2].insertedId, testId: tests.insertedIds['2'], doctorName: 'Dr. Rivera', status: 'validated', createdAt: now, preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patients[3].insertedId, testId: tests.insertedIds['3'], doctorName: 'Dr. Kim', status: 'delivered', createdAt: now, preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' },
    { patientId: patients[4].insertedId, testId: tests.insertedIds['4'], doctorName: 'Dr. Patel', status: 'booked', createdAt: now, preferredDate: '2026-08-01T10:00:00Z', collectionType: 'home' }
  ]);

  const sampleDocs = [];
  const statuses = ['in_transit', 'tested', 'validated', 'delivered', 'booked'];

  for (let index = 0; index < bookingDocs.insertedCount; index += 1) {
    const bookingId = bookingDocs.insertedIds[index];
    const sampleCode = `LS-${String(index + 1).padStart(4, '0')}`;
    const qrPayload = JSON.stringify({ bookingId: bookingId.toString(), sampleCode, role: 'demo' });
    const sample = await db.collection('samples').insertOne({ bookingId, sampleCode, qr_payload: qrPayload, currentStatus: statuses[index] });
    sampleDocs.push(sample);

    await db.collection('custody_ledger').insertOne({ sampleId: sample.insertedId, eventType: 'booked', actorId: admin.insertedId, timestamp: now, dataJson: JSON.stringify({ status: 'booked' }), prevHash: 'genesis', hash: `hash-${sample.insertedId.toString()}-booked` });

    if (index % 2 === 0) {
      await db.collection('sensor_readings').insertOne({ sampleId: sample.insertedId, timestamp: now, temperature: 8.8, humidity: 62, lat: 47.6062, lng: -122.3321, isAnomalous: true });
    }
  }

  await db.collection('results').insertMany([
    { sampleId: sampleDocs[0].insertedId, testId: tests.insertedIds['0'], value: 2.4, isAnomalous: true, isCritical: true, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocs[1].insertedId, testId: tests.insertedIds['1'], value: 180, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocs[2].insertedId, testId: tests.insertedIds['2'], value: 6.7, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now },
    { sampleId: sampleDocs[3].insertedId, testId: tests.insertedIds['3'], value: 3.2, isAnomalous: false, isCritical: false, validatedBy: path.insertedId, validatedAt: now }
  ]);

  await db.collection('notifications').insertMany([
    { userId: patientResults[0].insertedId, channel: 'email', message: 'Your sample is in transit', sentAt: now, isCriticalAlert: false },
    { userId: path.insertedId, channel: 'sms', message: 'Critical value requires escalation', sentAt: now, isCriticalAlert: true }
  ]);

  console.log('Seed data inserted');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
