import React from 'react';
import { patients } from '../../../mocks/patientData';

export default function Profile() {
  const p = patients[0];

  return (
    <div className="rounded-2xl bg-slate-900 p-6">
      <h3 className="text-xl font-semibold">Profile</h3>
      <div className="mt-4 space-y-2">
        <div><strong>Name:</strong> {p.name}</div>
        <div><strong>Email:</strong> {p.email}</div>
        <div className="mt-4">
          <h4 className="font-medium">Preferences</h4>
          <div className="mt-2 text-sm text-slate-400">Notifications: Enabled</div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-400">// TODO: wire settings to real profile API</p>
    </div>
  );
}
