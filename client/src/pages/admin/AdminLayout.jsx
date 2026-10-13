import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminTabs from './AdminTabs';

export default function AdminLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Admin dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold">LabSync AI Operations</h1>
              <p className="mt-2 text-slate-400">Operational analytics, custody oversight, and staff management for the lab network.</p>
            </div>
          </div>
        </header>

        <AdminTabs />

        <div className="rounded-3xl bg-slate-900 p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
