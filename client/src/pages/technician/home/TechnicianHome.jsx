import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collections, delay } from '../../../mocks/technicianData';

const tabs = [
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' }
];

function statusLabel(status) {
  switch (status) {
    case 'pending': return 'Pending';
    case 'collected': return 'Collected';
    case 'in_transit': return 'In Transit';
    case 'delivered': return 'Delivered to Lab';
    default: return 'Unknown';
  }
}

function statusColor(status) {
  switch (status) {
    case 'pending': return 'bg-amber-500 text-slate-950';
    case 'collected': return 'bg-sky-500 text-slate-950';
    case 'in_transit': return 'bg-indigo-600 text-white';
    case 'delivered': return 'bg-emerald-500 text-slate-950';
    default: return 'bg-slate-700 text-white';
  }
}

export default function TechnicianHome() {
  const [activeTab, setActiveTab] = useState('today');
  const [items, setItems] = useState(collections);

  const visible = useMemo(() => {
    const now = new Date();
    return items.filter((item) => {
      if (activeTab === 'completed') return item.status === 'delivered';
      if (activeTab === 'upcoming') return item.status === 'pending' && new Date(item.scheduledTime) > now;
      return item.status !== 'delivered';
    }).sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
  }, [activeTab, items]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Assigned collections</h2>
            <p className="mt-2 text-slate-400">Sorted by scheduled time and ready for your next stop.</p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-800 p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-full px-4 py-2 text-sm ${activeTab === tab.id ? 'bg-sky-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {visible.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">No tasks found for this view.</div>
      ) : (
        <div className="space-y-4">
          {visible.map((item) => (
            <Link key={item.id} to={`/technician/detail/${item.id}`} className="block rounded-3xl border border-slate-800 bg-slate-900 p-5 hover:border-sky-500">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm text-slate-400">{new Date(item.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.collectionType}</div>
                  <h3 className="mt-2 text-xl font-semibold">{item.patientName}</h3>
                  <p className="mt-1 text-slate-300">{item.testName}</p>
                </div>
                <div className="space-y-2 text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColor(item.status)}`}>{statusLabel(item.status)}</span>
                  <div className="text-sm text-slate-400">{item.address}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
