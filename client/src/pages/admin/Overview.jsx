import React from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { activityFeed, branches } from '../../mocks/adminData';

const cardData = (branches) => {
  const avgTurnaround = Number((branches.reduce((sum, branch) => sum + branch.avgTurnaround, 0) / branches.length).toFixed(1));
  const samplesInTransit = branches.reduce((sum, branch) => sum + branch.samplesInTransit, 0);
  const criticalAlerts = branches.reduce((sum, branch) => sum + branch.criticalAlerts, 0);
  const integrity = Math.round(branches.reduce((sum, branch) => sum + branch.integrity, 0) / branches.length);

  return [
    { label: 'Avg turnaround', value: `${avgTurnaround}h` },
    { label: 'Samples in transit', value: samplesInTransit },
    { label: 'Critical alerts', value: criticalAlerts },
    { label: 'Integrity', value: `${integrity}%` }
  ];
};

const anomalyData = branches[0]?.branchEvents ?? [];

export default function Overview() {
  const summary = cardData(branches);
  const chartData = branches.map((branch) => ({ name: branch.name.replace(/ Lab$/, ''), turnaround: branch.avgTurnaround }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-3xl bg-slate-950 p-6 shadow-sm">
            <div className="text-sm uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
            <div className="mt-4 text-3xl font-semibold text-amber-300">{item.value}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Turnaround by branch</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} aria-label="Average turnaround by branch">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="turnaround" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI-flagged anomalies</h2>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-sm text-slate-300">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={anomalyData} aria-label="AI flagged anomalies over the last 7 days">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="anomalies" stroke="#f87171" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live activity</h2>
          <span className="text-sm text-slate-400">Read-only operational events</span>
        </div>
        <div className="mt-4 space-y-3">
          {activityFeed.map((event) => (
            <div key={event.id} className="rounded-2xl bg-slate-900 p-4">
              <div className="text-sm text-slate-400">{new Date(event.ts).toLocaleString()} • {event.branch}</div>
              <div className="mt-1 text-slate-100">{event.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
