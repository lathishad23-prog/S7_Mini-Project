import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tests } from '../../../mocks/patientData';
import { branches } from '../../../mocks/adminData';
import { QRCodeCanvas } from 'qrcode.react';

export default function BookingForm() {
  const [testId, setTestId] = useState(tests[0].id);
  const [collectionType, setCollectionType] = useState('home');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const branch = useMemo(() => branches.find((branchItem) => branchItem.id === branchId) || branches[0], [branchId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!date) {
      setError('Please select a preferred date and time.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          testId,
          branchId: branch.id,
          branchName: branch.name,
          preferredDate: date,
          collectionType,
          doctorName
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || 'Failed to place booking');
      }

      setConfirmation({
        sampleId: result.sampleCode,
        testName: tests.find((t) => t.id === testId).name,
        collectionType,
        branchName: branch.name,
        technicianName: result.assignedTechnicianName,
        technicianWaiting: result.technicianWaiting,
        technicianWorkload: result.technicianWorkload
      });
    } catch (err) {
      setError(err.message || 'Unable to complete booking');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="rounded-2xl bg-slate-900 p-6">
        <h3 className="text-xl font-semibold">Booking confirmed</h3>
        <p className="mt-2 text-slate-400">Sample code: <strong>{confirmation.sampleId}</strong></p>
        <p className="mt-2 text-slate-400">Test: <strong>{confirmation.testName}</strong></p>
        <p className="mt-2 text-slate-400">Collection type: <strong>{confirmation.collectionType === 'home' ? 'Home pickup' : 'Branch visit'}</strong></p>
        <p className="mt-2 text-slate-400">Assigned branch: <strong>{confirmation.branchName}</strong></p>
        <p className="mt-2 text-slate-400">Assigned technician: <strong>{confirmation.technicianName}</strong></p>
        <p className="mt-2 text-slate-400">Technician queue: <strong>{confirmation.technicianWaiting}/5 waiting</strong></p>
        <p className="mt-2 text-slate-400">Technician workload: <strong>{confirmation.technicianWorkload} active tasks</strong></p>
        <div className="mt-4">
          <QRCodeCanvas value={confirmation.sampleId} size={128} />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded bg-sky-600 px-3 py-2" onClick={() => navigate(`/patient/track/${confirmation.sampleId}`)}>Track sample</button>
          <button className="rounded bg-slate-700 px-3 py-2" onClick={() => navigate('/patient')}>Back to dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <form className="rounded-2xl bg-slate-900 p-6" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-4">Book a test</h3>
      <label className="block text-sm mb-1">Test</label>
      <select className="w-full mb-3 rounded p-2" value={testId} onChange={(e) => setTestId(e.target.value)}>
        {tests.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <label className="block text-sm mb-1">Branch</label>
      <select className="w-full mb-3 rounded p-2" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
        {branches.map((branchItem) => (
          <option key={branchItem.id} value={branchItem.id}>{branchItem.name}</option>
        ))}
      </select>

      <label className="block text-sm mb-1">Collection type</label>
      <select className="w-full mb-3 rounded p-2" value={collectionType} onChange={(e) => setCollectionType(e.target.value)}>
        <option value="home">Home pickup</option>
        <option value="walkin">Walk-in to branch</option>
      </select>

      <label className="block text-sm mb-1">Doctor name</label>
      <input className="w-full mb-3 rounded p-2" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Enter your doctor" />

      <label className="block text-sm mb-1">Preferred date & time</label>
      <input className="w-full mb-3 rounded p-2" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

      <label className="block text-sm mb-1">Attach prescription (optional)</label>
      <input className="w-full mb-3 rounded p-2" type="file" onChange={() => { /* stub */ }} />

      <div className="flex gap-2">
        <button className="rounded bg-emerald-600 px-4 py-2" type="submit" disabled={submitting}>{submitting ? 'Booking...' : 'Confirm booking'}</button>
        <button className="rounded bg-slate-700 px-4 py-2" type="button" onClick={() => navigate('/patient')}>Cancel</button>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
