import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { samples } from '../../mocks/adminData';

export default function Samples() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [preset, setPreset] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return samples.filter((sample) => {
      if (preset === 'broken' && !sample.custodyBroken) return false;
      if (preset === 'delayed' && !sample.delayed) return false;
      if (preset === 'critical' && !sample.critical) return false;
      if (q && !`${sample.sampleId} ${sample.patientName} ${sample.branch} ${sample.status} ${sample.testName}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [preset, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sample, patient, branch" className="rounded-3xl bg-slate-900 p-4 text-slate-100" />
          <select value={preset} onChange={(e) => setPreset(e.target.value)} className="rounded-3xl bg-slate-900 p-4 text-slate-100">
            <option value="all">All samples</option>
            <option value="broken">Broken custody chain</option>
            <option value="delayed">Delayed</option>
            <option value="critical">Critical — pending sign-off</option>
          </select>
        </div>
      </section>

      <div className="overflow-x-auto rounded-3xl bg-slate-950 p-6 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Sample</th><th className="px-3">Patient</th><th className="px-3">Branch</th><th className="px-3">Status</th><th className="px-3">Integrity</th><th className="px-3">Flag</th></tr></thead>
          <tbody>
            {filtered.map((sample) => (
              <tr key={sample.id} className="cursor-pointer border-b border-slate-800 hover:bg-slate-900/50" onClick={() => navigate(`/admin/samples/detail/${sample.id}`)}>
                <td className="py-3 px-3">{sample.sampleId}</td>
                <td className="px-3">{sample.patientName}</td>
                <td className="px-3">{sample.branch}</td>
                <td className="px-3">{sample.status}</td>
                <td className={`px-3 font-semibold ${sample.integrity === 'Pass' ? 'text-emerald-300' : 'text-red-400'}`}>{sample.integrity}</td>
                <td className={`px-3 font-semibold ${sample.critical ? 'text-red-400' : sample.delayed ? 'text-amber-300' : 'text-slate-300'}`}>{sample.flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
