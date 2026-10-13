import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { samples, delay } from '../../../mocks/adminData';

export default function SampleDetail() {
  const { id } = useParams();
  const [sample, setSample] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      const found = samples.find((item) => item.id === id);
      setSample(found || null);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (!sample) {
    return <div className="rounded-3xl bg-slate-900 p-6">Sample not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Sample detail</p>
            <h1 className="text-2xl font-semibold">{sample.sampleId}</h1>
            <p className="mt-2 text-slate-400">{sample.testName} • {sample.branch}</p>
          </div>
          <div className="rounded-3xl bg-slate-800 px-4 py-2 text-slate-200">{sample.status}</div>
        </div>
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Custody ledger</h2>
          <div className="mt-4 space-y-3">
            {sample.ledger.map((entry, index) => (
              <div key={index} className="rounded-2xl bg-slate-950 p-4">
                <div className="text-sm text-slate-400">{new Date(entry.ts).toLocaleString()}</div>
                <div className="mt-1 text-slate-100">{entry.text}</div>
                <div className="mt-2 text-xs text-slate-500">Hash: {entry.hash}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Sample summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div><span className="font-semibold text-slate-100">Patient:</span> {sample.patientName}</div>
            <div><span className="font-semibold text-slate-100">Branch:</span> {sample.branch}</div>
            <div><span className="font-semibold text-slate-100">Doctor:</span> {sample.doctor}</div>
            <div><span className="font-semibold text-slate-100">Integrity:</span> {sample.integrity}</div>
            <div><span className="font-semibold text-slate-100">Flag:</span> {sample.flag}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
