import React, { useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import ReviewQueue from './ReviewQueue';
import ReviewDetail from './detail/ReviewDetail';
import SignedHistory from './history/SignedHistory';
import PathologistProfile from './profile/PathologistProfile';

function SupportInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">Support</h2>
        <p className="mt-3 text-slate-400">Need help? Contact the lab operations team or review common pathologist workflows below.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Workflow guide</h3>
          <p className="mt-3 text-slate-300">Use the review queue to triage critical findings, then sign and archive completed reports.</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Support contacts</h3>
          <p className="mt-3 text-slate-300">Lab ops: ops@labsync.ai</p>
          <p className="mt-1 text-slate-300">IT support: support@labsync.ai</p>
        </div>
      </div>
    </div>
  );
}

export default function PathologistDashboard() {
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-violet-400">Pathologist dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">Dr. Asha Patel</h1>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 text-right">
              <div className="text-sm text-slate-400">Today</div>
              <div className="mt-1 text-xl font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </header>

        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <NavLink end to="." className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-violet-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Review queue
          </NavLink>
          <NavLink to="history" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-violet-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Signed history
          </NavLink>
          <NavLink to="profile" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-violet-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Profile
          </NavLink>
          <NavLink to="support" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-violet-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Support
          </NavLink>
        </nav>

        <Routes>
          <Route index element={<ReviewQueue />} />
          <Route path="detail/:id" element={<ReviewDetail />} />
          <Route path="history" element={<SignedHistory />} />
          <Route path="profile" element={<PathologistProfile />} />
          <Route path="support" element={<SupportInfo />} />
        </Routes>
      </div>
    </div>
  );
}
