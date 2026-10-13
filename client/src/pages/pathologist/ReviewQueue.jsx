import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { reviewQueue } from '../../mocks/pathologistData';

const tabs = [
  { id: 'pending', label: 'Pending Review' },
  { id: 'signed', label: 'Signed Today' },
  { id: 'all', label: 'All' }
];

function statusStyle(status) {
  switch (status) {
    case 'critical': return 'bg-red-600 text-white ring-1 ring-red-500';
    case 'flagged': return 'bg-amber-500 text-slate-950 ring-1 ring-amber-400';
    default: return 'bg-slate-700 text-slate-100 ring-1 ring-slate-600';
  }
}

function sortQueue(items) {
  return [...items].sort((a, b) => {
    const priority = { critical: 0, flagged: 1, routine: 2 };
    if (priority[a.status] !== priority[b.status]) return priority[a.status] - priority[b.status];
    return new Date(a.availableAt) - new Date(b.availableAt);
  });
}

export default function ReviewQueue() {
  const [activeTab, setActiveTab] = useState('pending');

  const visible = useMemo(() => {
    const now = new Date();
    const items = reviewQueue.filter((item) => {
      if (activeTab === 'signed') return item.status !== 'pending';
      if (activeTab === 'all') return true;
      return item.status === 'pending';
    });
    return sortQueue(items);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Review queue</h2>
            <p className="mt-2 text-slate-400">Critical cases are pinned to the top so they can't be missed.</p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-800 p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-full px-4 py-2 text-sm ${activeTab === tab.id ? 'bg-violet-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {visible.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">No reports match this filter.</div>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <Link key={item.id} to={`/pathologist/detail/${item.id}`} className={`group block rounded-3xl border ${item.status === 'critical' ? 'border-red-500 bg-red-950/10 shadow-lg shadow-red-500/10' : 'border-slate-800 bg-slate-900'} p-5 transition hover:border-violet-400`}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyle(item.status)}`}>{item.status === 'critical' ? 'Critical' : item.status === 'flagged' ? 'Flagged' : 'Routine'}</span>
                    <div className="text-sm text-slate-400">{item.patientName} • {item.sampleId}</div>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{item.testName}</h3>
                  <p className="mt-2 text-slate-300">Result available at {new Date(item.availableAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="text-right text-slate-400">
                  <p>Collection: {new Date(item.collectedAt).toLocaleString()}</p>
                  <p className="mt-2">Ordering doctor: {item.doctor}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
