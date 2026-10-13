import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { samples, reports, patients, tests, delay } from '../../../mocks/patientData';

export default function Home() {
  const [mySamples, setMySamples] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const patient = patients[0];

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      setMySamples(samples.filter((s) => s.patientId === patient.id));
      setMyReports(reports.filter((r) => samples.find((s) => s.id === r.sampleId && s.patientId === patient.id)));
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Welcome back, {patient.name}</h1>
        <p className="text-slate-400 mt-1">Book a test or track your samples.</p>
        <div className="mt-4">
          <Link to="/patient/book" className="rounded bg-emerald-600 px-4 py-2">Book a test</Link>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Active samples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {mySamples.length === 0 && <div className="rounded-2xl bg-slate-900 p-6 text-slate-400">No active samples yet.</div>}
          {mySamples.map((s) => (
            <div key={s.id} className="rounded-2xl bg-slate-900 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-400">{s.testName}</div>
                  <div className="mt-1 font-semibold">{s.id}</div>
                </div>
                <div className="text-sm rounded px-2 py-1 bg-slate-800">{s.status.replace('_', ' ')}</div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link to={`/patient/track/${s.id}`} className="rounded bg-sky-600 px-3 py-2">Track</Link>
                <Link to={`/patient/report/${s.id}`} className="rounded bg-slate-700 px-3 py-2">View report</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Recent reports</h2>
        <div className="space-y-2">
          {myReports.length === 0 && <div className="rounded-2xl bg-slate-900 p-6 text-slate-400">No reports yet.</div>}
          {myReports.slice(0, 5).map((r) => (
            <div key={r.id} className="rounded-2xl bg-slate-900 p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{r.testName}</div>
                <div className="text-sm text-slate-400">{new Date(r.date).toLocaleString()}</div>
              </div>
              <Link to={`/patient/report/${r.sampleId}`} className="rounded bg-emerald-600 px-3 py-2">View report</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
