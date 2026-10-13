import React from 'react';
import { technician, collections } from '../../../mocks/technicianData';

export default function TechnicianProfile() {
  const assignedToday = collections.filter((item) => new Date(item.scheduledTime).toDateString() === new Date().toDateString());
  const collected = assignedToday.filter((item) => item.status === 'collected').length;
  const delivered = assignedToday.filter((item) => item.status === 'delivered').length;
  const breaches = assignedToday.filter((item) => item.readings?.some((r) => r.temperature < 2 || r.temperature > 8)).length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">{technician.name}</h2>
        <p className="mt-2 text-slate-400">{technician.branch}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">Samples collected</div>
          <div className="mt-3 text-3xl font-semibold text-emerald-300">{collected}</div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">Samples delivered</div>
          <div className="mt-3 text-3xl font-semibold text-sky-300">{delivered}</div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">Cold-chain breaches</div>
          <div className="mt-3 text-3xl font-semibold text-red-400">{breaches}</div>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-900 p-6">
        <h3 className="text-lg font-semibold">Shift summary</h3>
        <p className="mt-3 text-slate-300">You have {assignedToday.length} assigned samples today. Stay aware of any flagged temperature readings and confirm collections quickly.</p>
      </div>
    </div>
  );
}
