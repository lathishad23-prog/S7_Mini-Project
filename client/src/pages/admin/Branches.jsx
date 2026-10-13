import React from 'react';
import { Link } from 'react-router-dom';
import { branches } from '../../mocks/adminData';

export default function Branches() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Branch network</h2>
          <p className="mt-2 text-slate-400">Overview of performance, capacity, and cold-chain breaches by location.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {branches.map((branch) => (
          <Link key={branch.id} to={`/admin/branches/${branch.id}`} className="rounded-3xl bg-slate-950 p-6 shadow-sm hover:border hover:border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{branch.name}</h3>
                <p className="mt-1 text-slate-400">{branch.address}</p>
              </div>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300">{branch.technicians} techs</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div>Avg turnaround: {branch.avgTurnaround}h</div>
              <div>Samples in transit: {branch.samplesInTransit}</div>
              <div>Integrity: {branch.integrity}%</div>
              <div>Breaches: {branch.coldChainBreaches}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
