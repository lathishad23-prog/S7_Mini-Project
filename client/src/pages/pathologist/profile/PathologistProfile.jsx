import React from 'react';
import { pathologist, reviewQueue } from '../../../mocks/pathologistData';

export default function PathologistProfile() {
  const signedToday = reviewQueue.filter((item) => item.status !== 'pending').length;
  const pending = reviewQueue.filter((item) => item.status === 'pending').length;
  const critical = reviewQueue.filter((item) => item.status === 'critical').length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">{pathologist.name}</h2>
        <p className="mt-2 text-slate-400">{pathologist.hospital}</p>
        <p className="mt-2 text-sm text-slate-500">{pathologist.license}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">On duty</div>
          <div className="mt-2 text-xl font-semibold text-emerald-300">{pathologist.onDuty ? 'Yes' : 'No'}</div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">Pending reviews</div>
          <div className="mt-2 text-xl font-semibold">{pending}</div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="text-sm text-slate-400">Critical cases</div>
          <div className="mt-2 text-xl font-semibold text-red-400">{critical}</div>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-900 p-6">
        <h3 className="text-xl font-semibold">Credentials</h3>
        <p className="mt-3 text-slate-300">Registered digital signature and license information are stored for all clinical actions.</p>
      </div>
    </div>
  );
}
