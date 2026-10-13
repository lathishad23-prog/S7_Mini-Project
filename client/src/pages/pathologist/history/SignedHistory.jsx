import React, { useMemo, useState } from 'react';
import { signedReports } from '../../../mocks/pathologistData';

export default function SignedHistory() {
  const [filter, setFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return signedReports.filter((report) => {
      const text = `${report.patientName} ${report.testName}`.toLowerCase();
      if (filter && !text.includes(filter.toLowerCase())) return false;
      const date = new Date(report.signedAt);
      if (dateFrom && date < new Date(dateFrom)) return false;
      if (dateTo && date > new Date(dateTo)) return false;
      return true;
    });
  }, [filter, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <input className="rounded-3xl bg-slate-800 p-4 text-slate-100" placeholder="Search patient or test" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <input className="rounded-3xl bg-slate-800 p-4 text-slate-100" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          <input className="rounded-3xl bg-slate-800 p-4 text-slate-100" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </section>
      <div className="rounded-3xl bg-slate-900 p-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3">Signed date</th>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Test</th>
              <th className="py-3 px-3">Outcome</th>
              <th className="py-3 px-3">Ordering doctor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((report) => (
              <tr key={report.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                <td className="py-3 px-3">{new Date(report.signedAt).toLocaleString()}</td>
                <td className="py-3 px-3">{report.patientName}</td>
                <td className="py-3 px-3">{report.testName}</td>
                <td className={`py-3 px-3 font-semibold ${report.outcome === 'escalated' ? 'text-red-400' : 'text-emerald-300'}`}>{report.outcome}</td>
                <td className="py-3 px-3">{report.doctor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
