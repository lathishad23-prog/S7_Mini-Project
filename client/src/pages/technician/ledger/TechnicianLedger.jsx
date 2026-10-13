import React, { useMemo, useState } from 'react';
import { collections, delay } from '../../../mocks/technicianData';

function computeChain(items) {
  return items.map((entry, idx) => {
    const previous = items[idx - 1];
    return {
      ...entry,
      valid: !previous || entry.hash !== previous.hash
    };
  });
}

export default function TechnicianLedger() {
  const [sampleId, setSampleId] = useState('LS-00123');
  const [ledger, setLedger] = useState([]);
  const [integrity, setIntegrity] = useState(null);

  const sample = useMemo(() => collections.find((item) => item.sampleId === sampleId), [sampleId]);

  async function handleVerify() {
    await delay(150);
    const chain = computeChain(sample?.ledger || []);
    setLedger(chain);
    setIntegrity(chain.every((entry) => entry.valid));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Custody ledger</h2>
            <p className="mt-2 text-slate-400">Review the full event history and verify the integrity of the chain.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              className="rounded-2xl bg-slate-800 p-3 text-slate-100"
              value={sampleId}
              onChange={(e) => setSampleId(e.target.value)}
              placeholder="Sample ID"
            />
            <button className="rounded-2xl bg-sky-600 px-4 py-3" onClick={handleVerify}>Verify chain integrity</button>
          </div>
        </div>
      </section>

      {sample ? (
        <div className="space-y-4">
          {integrity !== null && (
            <div className={`rounded-3xl p-5 text-lg font-semibold ${integrity ? 'bg-emerald-600/15 text-emerald-300' : 'bg-red-600/15 text-red-300'}`}>
              Chain integrity: {integrity ? 'PASS' : 'FAIL'}
            </div>
          )}
          <div className="rounded-3xl bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">Sample: {sample.sampleId}</h3>
            <div className="mt-4 space-y-3">
              {sample.ledger.map((entry, idx) => (
                <div key={idx} className="rounded-2xl bg-slate-800 p-4">
                  <div className="text-sm text-slate-400">{new Date(entry.ts).toLocaleString()}</div>
                  <div className="mt-1 text-slate-100">{entry.event} — {entry.text}</div>
                  <div className="mt-2 text-xs text-slate-500">Hash: {entry.hash}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">Enter a valid sample ID to show ledger entries.</div>
      )}
    </div>
  );
}
