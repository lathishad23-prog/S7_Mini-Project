import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { branches, technicians, pathologists, samples } from '../../../mocks/adminData';

export default function BranchDetail() {
  const { id } = useParams();
  const branch = branches.find((branch) => branch.id === id);
  const branchStaff = useMemo(() => {
    const branchName = branch?.name;
    return {
      technicians: technicians.filter((tech) => tech.branch === branchName),
      pathologists: pathologists.filter((path) => path.branch === branchName)
    };
  }, [branch]);

  const branchSamples = useMemo(() => {
    const branchName = branch?.name;
    return samples.filter((sample) => sample.branch === branchName);
  }, [branch]);

  const sampleCounts = useMemo(() => ({
    all: branchSamples.length,
    collected: branchSamples.filter((sample) => ['In transit', 'Delayed'].includes(sample.status)).length,
    underReview: branchSamples.filter((sample) => sample.status === 'Awaiting sign-off').length,
    completed: branchSamples.filter((sample) => ['Delivered', 'Signed'].includes(sample.status)).length
  }), [branchSamples]);

  if (!branch) {
    return <div className="rounded-3xl bg-slate-900 p-6">Branch not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">{branch.name}</h1>
        <p className="mt-2 text-slate-400">{branch.address}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Technicians" value={branch.technicians} />
        <StatCard label="Avg turnaround" value={`${branch.avgTurnaround}h`} />
        <StatCard label="In transit" value={branch.samplesInTransit} />
        <StatCard label="Breaches" value={branch.coldChainBreaches} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Branch staff</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>Technicians: {branchStaff.technicians.length}</div>
            <div>Pathologists: {branchStaff.pathologists.length}</div>
            <div>Total on duty: {branchStaff.technicians.filter((tech) => tech.onDuty).length + branchStaff.pathologists.filter((path) => path.onDuty).length}</div>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Branch sample categories</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>Collected: {sampleCounts.collected}</div>
            <div>Under review: {sampleCounts.underReview}</div>
            <div>Completed: {sampleCounts.completed}</div>
            <div>Total samples: {sampleCounts.all}</div>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Staff details</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div className="font-semibold text-slate-100">Technicians</div>
            {branchStaff.technicians.map((tech) => (
              <div key={tech.id}>{tech.name} • {tech.shift} • {tech.onDuty ? 'On duty' : 'Off duty'}</div>
            ))}
            <div className="mt-3 font-semibold text-slate-100">Pathologists</div>
            {branchStaff.pathologists.map((path) => (
              <div key={path.id}>{path.name} • {path.onDuty ? 'On duty' : 'Off duty'}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Branch anomaly trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={branch.branchEvents} aria-label={`Anomaly trend for ${branch.name}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="anomalies" stroke="#f87171" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-950 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-amber-300">{value}</p>
    </div>
  );
}
