import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/staff', label: 'Staff' },
  { to: '/admin/samples', label: 'Samples' },
  { to: '/admin/branches', label: 'Branches' },
  { to: '/admin/escalations', label: 'Escalations' },
  { to: '/admin/settings', label: 'Settings' }
];

export default function AdminTabs() {
  return (
    <nav className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/admin/overview'}
          aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
          className={({ isActive }) =>
            `w-full rounded-[12px] px-5 py-4 text-center font-medium transition ${
              isActive
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
