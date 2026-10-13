import React, { useMemo, useState } from 'react';
import { escalationLogs, branches } from '../../mocks/adminData';

export default function Escalations() {
  const [branch, setBranch] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const filtered = useMemo(() => escalationLogs.filter((log) => {
    const ts = new Date(log.timestamp);
    if (branch !== 'all' && log.branch !== branch) return false;
    if (from && ts < new Date(from)) return false;
    if (to && ts > new Date(to)) return false;
    return true;
  }), [branch, from, to]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-4">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-3xl bg-slate-900 p-4 text-slate-100" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-3xl bg-slate-900 p-4 text-slate-100" />
          <select value={branch} onChange={(e) => setBranch(e.target.value)} className="rounded-3xl bg-slate-900 p-4 text-slate-100">
            <option value="all">All branches</option>
            {branches.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
          <button onClick={() => console.log('Export CSV stub')} className="rounded-3xl bg-amber-500 px-5 py-3 text-slate-950">Export CSV</button>
        </div>
      </section>

      <div className="overflow-x-auto rounded-3xl bg-slate-950 p-6 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Timestamp</th><th className="px-3">Patient</th><th className="px-3">Parameter</th><th className="px-3">Pathologist</th><th className="px-3">Doctor</th><th className="px-3">Confirmed</th></tr></thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                <td className="py-3 px-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-3">{log.patientName}</td>
                <td className="px-3">{log.parameter}</td>
                <td className="px-3">{log.pathologist}</td>
                <td className="px-3">{log.doctorNotified}</td>
                <td className="px-3 text-emerald-300">{log.deliveryConfirmed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
