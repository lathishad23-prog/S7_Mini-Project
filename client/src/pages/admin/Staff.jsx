import React, { useState } from 'react';
import { pathologists, technicians } from '../../mocks/adminData';

export default function Staff() {
  const [techRows, setTechRows] = useState(technicians);
  const [pathRows, setPathRows] = useState(pathologists);

  const toggleTechDuty = (id) => {
    setTechRows((current) => current.map((tech) => (tech.id === id ? { ...tech, onDuty: !tech.onDuty } : tech)));
  };

  const togglePathDuty = (id) => {
    setPathRows((current) => current.map((path) => (path.id === id ? { ...path, onDuty: !path.onDuty } : path)));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Technician & pathologist staff</h2>
            <p className="mt-2 text-slate-400">Review active duties, workload, and on-duty status across the network.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-semibold">Technicians</h3>
          <table className="mt-4 min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Name</th><th className="px-3">Branch</th><th className="px-3">Collected</th><th className="px-3">Workload</th><th className="px-3">Shift</th><th className="px-3">Duty</th></tr></thead>
            <tbody>
              {techRows.map((tech) => (
                <tr key={tech.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-3 px-3">{tech.name}</td>
                  <td className="px-3">{tech.branch}</td>
                  <td className="px-3">{tech.todayCollected}</td>
                  <td className="px-3">{tech.workload}</td>
                  <td className="px-3">{tech.shift}</td>
                  <td className="px-3">
                    <button onClick={() => toggleTechDuty(tech.id)} className={`rounded-full px-3 py-1 text-xs ${tech.onDuty ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
                      {tech.onDuty ? 'On duty' : 'Off duty'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-semibold">Pathologists</h3>
          <table className="mt-4 min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Name</th><th className="px-3">Signed today</th><th className="px-3">Avg sign time</th><th className="px-3">Pending critical</th><th className="px-3">Duty</th></tr></thead>
            <tbody>
              {pathRows.map((path) => (
                <tr key={path.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-3 px-3">{path.name}</td>
                  <td className="px-3">{path.signedToday}</td>
                  <td className="px-3">{path.avgSignTime}h</td>
                  <td className="px-3">{path.pendingCritical}</td>
                  <td className="px-3">
                    <button onClick={() => togglePathDuty(path.id)} className={`rounded-full px-3 py-1 text-xs ${path.onDuty ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
                      {path.onDuty ? 'On duty' : 'Off duty'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
