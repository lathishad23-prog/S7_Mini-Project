import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { samples, delay } from '../../../mocks/patientData';

function LedgerItem({ item }) {
  return (
    <div className="rounded bg-slate-900 p-3">
      <div className="text-sm text-slate-400">{new Date(item.ts).toLocaleString()}</div>
      <div className="mt-1">{item.text}</div>
    </div>
  );
}

export default function TrackingView() {
  const { id } = useParams();
  const [sample, setSample] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      const s = samples.find((x) => x.id === id) || samples.find((x) => x.bookingId === id);
      setSample(s || null);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (!sample) {
    return <div className="rounded-2xl bg-slate-900 p-6">Sample not found in mock dataset.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">{sample.testName}</div>
            <div className="mt-1 font-semibold">{sample.id}</div>
          </div>
          <div className="text-sm rounded px-2 py-1 bg-slate-800">{sample.status}</div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Live readings</h4>
          {sample.readings.length === 0 && <div className="text-slate-400 mt-2">No sensor readings available.</div>}
          {sample.readings.map((r, idx) => (
            <div key={idx} className="mt-2">{new Date(r.ts).toLocaleTimeString()} — Temp: {r.temp}°C</div>
          ))}
        </div>
      </div>

      <section>
        <h4 className="mb-2 text-lg font-semibold">Ledger</h4>
        <div className="space-y-2">
          {sample.ledger.map((l, idx) => <LedgerItem key={idx} item={l} />)}
        </div>
      </section>
    </div>
  );
}
