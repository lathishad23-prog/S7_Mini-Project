import React, { useState } from 'react';
import { coldChainThresholds, notificationSettings, referenceRanges } from '../../mocks/adminData';

export default function Settings() {
  const [ranges, setRanges] = useState(referenceRanges);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [thresholds, setThresholds] = useState(coldChainThresholds);

  const updateRange = (id, field, value) => setRanges((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  const updateThreshold = (id, field, value) => setThresholds((current) => current.map((item) => (item.id === id ? { ...item, [field]: Number(value) } : item)));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-950 p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Reference range management</h2>
        <p className="mt-2 text-slate-400">These values feed the AI validation engine and affect flagging logic downstream.</p>
        <div className="mt-4 overflow-x-auto rounded-3xl bg-slate-900 p-4">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Test type</th><th className="px-3">Normal</th><th className="px-3">Critical</th></tr></thead>
            <tbody>
              {ranges.map((range) => (
                <tr key={range.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                  <td className="py-3 px-3">{range.testType}</td>
                  <td className="px-3"><input value={range.normal} onChange={(e) => updateRange(range.id, 'normal', e.target.value)} className="w-full rounded-2xl bg-slate-800 p-2 text-slate-100" /></td>
                  <td className="px-3"><input value={range.critical} onChange={(e) => updateRange(range.id, 'critical', e.target.value)} className="w-full rounded-2xl bg-slate-800 p-2 text-slate-100" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Notification channels</h3>
          <div className="mt-4 space-y-3">
            {['sms', 'whatsapp', 'voice'].map((channel) => (
              <label key={channel} className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4">
                <input type="checkbox" checked={notifications[channel]} onChange={(e) => setNotifications((prev) => ({ ...prev, [channel]: e.target.checked }))} />
                <span className="text-slate-200">Enable {channel.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-950 p-6 shadow-sm">
          <h3 className="text-xl font-semibold">Cold-chain temperature thresholds</h3>
          <div className="mt-4 space-y-3">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="grid gap-3 md:grid-cols-3">
                <div>{threshold.sampleType}</div>
                <input type="number" value={threshold.min} onChange={(e) => updateThreshold(threshold.id, 'min', e.target.value)} className="rounded-2xl bg-slate-900 p-2 text-slate-100" />
                <input type="number" value={threshold.max} onChange={(e) => updateThreshold(threshold.id, 'max', e.target.value)} className="rounded-2xl bg-slate-900 p-2 text-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
