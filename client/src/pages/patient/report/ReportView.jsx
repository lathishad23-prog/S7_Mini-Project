import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { reports, samples, delay } from '../../../mocks/patientData';

export default function ReportView() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [sample, setSample] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      const s = samples.find((x) => x.id === id) || samples.find((x) => x.bookingId === id);
      setSample(s || null);
      const r = reports.find((rep) => rep.sampleId === (s ? s.id : id));
      setReport(r || null);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (!sample) return <div className="rounded-2xl bg-slate-900 p-6">Sample not found.</div>;

  if (!report) return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <h3 className="font-semibold">Result not yet available</h3>
      <p className="text-slate-400">Your sample {sample.id} is still being processed.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">{report.testName}</div>
            <div className="mt-1 font-semibold">Report • {sample.id}</div>
          </div>
          <div className="text-sm text-slate-400">{new Date(report.date).toLocaleString()}</div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Parameters</h4>
          <div className="mt-2 space-y-2">
            {report.parameters.map((p, idx) => (
              <div key={idx} className="rounded bg-slate-800 p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-slate-400">Ref: {p.low} - {p.high}</div>
                </div>
                <div className={`text-sm font-semibold ${p.value < p.low || p.value > p.high ? 'text-amber-400' : 'text-emerald-400'}`}>{p.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded bg-sky-600 px-3 py-2" onClick={() => { window.speechSynthesis.cancel(); const t = new SpeechSynthesisUtterance(`Report ${report.testName} values: ${report.parameters.map(p => p.name + ' ' + p.value).join(', ')}`); window.speechSynthesis.speak(t); }}>Read aloud</button>
          <button className="rounded bg-slate-700 px-3 py-2" onClick={() => { window.print(); }}>Download / Print</button>
        </div>
      </div>
    </div>
  );
}
