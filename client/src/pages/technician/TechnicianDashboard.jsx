import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import TechnicianHome from './home/TechnicianHome';
import TechnicianDetail from './detail/TechnicianDetail';
import TechnicianTransport from './transport/TechnicianTransport';
import TechnicianLedger from './ledger/TechnicianLedger';
import TechnicianProfile from './profile/TechnicianProfile';

const navClasses = ({ isActive }) =>
  `rounded-2xl p-4 text-center text-slate-100 transition-colors duration-150 ${isActive ? 'bg-sky-600' : 'bg-slate-900 hover:bg-slate-800'}`;

function SupportInfo() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">Support</h2>
        <p className="mt-3 text-slate-400">Need help with a collection or chain-of-custody issue? Review the field support guidance below.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Field checklist</h3>
          <p className="mt-3 text-slate-300">Verify the sample ID, confirm cold-chain values, and update the ledger before handoff.</p>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Support contacts</h3>
          <p className="mt-3 text-slate-300">Ops hotline: +1 (800) 555-0144</p>
          <p className="mt-1 text-slate-300">Lab support: support@labsync.ai</p>
        </div>
      </div>
    </div>
  );
}

export default function TechnicianDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Technician dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">Ravi Kumar</h1>
            </div>
            <div className="rounded-2xl bg-slate-800 p-4 text-slate-300">
              <div className="text-sm">Today</div>
              <div className="mt-1 text-xl font-semibold">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </header>

        <nav className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <NavLink end to="." className={navClasses}>Tasks</NavLink>
          <NavLink to="transport" className={navClasses}>In transit</NavLink>
          <NavLink to="ledger" className={navClasses}>Ledger</NavLink>
          <NavLink to="profile" className={navClasses}>Profile</NavLink>
          <NavLink to="support" className={navClasses}>Support</NavLink>
        </nav>

        <Routes>
          <Route index element={<TechnicianHome />} />
          <Route path="detail/:id" element={<TechnicianDetail />} />
          <Route path="transport" element={<TechnicianTransport />} />
          <Route path="ledger" element={<TechnicianLedger />} />
          <Route path="profile" element={<TechnicianProfile />} />
          <Route path="support" element={<SupportInfo />} />
          <Route path="*" element={<TechnicianHome />} />
        </Routes>
      </div>
    </div>
  );
}
