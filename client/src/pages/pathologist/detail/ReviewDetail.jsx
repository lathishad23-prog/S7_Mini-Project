import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reviewQueue, delay } from '../../../mocks/pathologistData';

export default function ReviewDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [reason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [toast, setToast] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      const found = reviewQueue.find((item) => item.id === id);
      setReport(found || null);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const critical = report?.status === 'critical';
  const flagged = report?.status === 'flagged';

  const summary = useMemo(() => {
    if (!report) return [];
    return report.flags.map((flag) => ({ text: flag }));
  }, [report]);

  const handleAction = (type) => {
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = () => {
    setShowModal(false);
    setConfirmation(`Action '${actionType}' recorded for ${report?.sampleId}.`);
    if (actionType === 'Sign & Escalate') {
      setToast(`Doctor ${report.doctor} notified via priority alert.`);
    }
    if (actionType === 'Request Re-test') {
      setToast('Re-test requested. Reason logged.');
    }
    if (actionType === 'Sign & Release') {
      setToast('Report signed and scheduled for standard delivery.');
    }
    // TODO: replace with real POST /reports/{id}/action backend API
  };

  if (!report) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">Review not found.</div>;
  }

  return (
    <div className="space-y-6">
      {toast && <div className="rounded-3xl bg-emerald-600/10 p-4 text-emerald-200">{toast}</div>}
      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{report.patientName}</h2>
            <p className="mt-2 text-slate-400">{report.testName}</p>
          </div>
          <div className="rounded-3xl bg-slate-800 p-4">
            <div className="text-sm text-slate-400">Chain status</div>
            <div className="mt-1 text-lg font-semibold">{report.chainStatus}</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-800 p-4">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Patient</div>
            <div className="mt-2 text-lg font-semibold">{report.patientName} • {report.age} yrs • {report.sex}</div>
          </div>
          <div className="rounded-3xl bg-slate-800 p-4">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Collected</div>
            <div className="mt-2 text-lg font-semibold">{new Date(report.collectedAt).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">AI validation summary</h3>
            <p className="mt-2 text-slate-400">Review flagged values below before signing.</p>
          </div>
          <div className="rounded-3xl bg-slate-800 p-4 text-slate-300">
            <div className="text-sm">Doctor</div>
            <div className="mt-1 font-semibold">{report.doctor}</div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {summary.length === 0 ? (
            <div className="rounded-3xl bg-slate-800 p-4 text-slate-400">No AI flags — result appears routine.</div>
          ) : summary.map((item, idx) => (
            <div key={idx} className="rounded-3xl bg-amber-950/20 p-4 text-amber-100">{item.text}</div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold">Parameter review</h3>
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-3 px-3">Parameter</th>
              <th className="py-3 px-3">Value</th>
              <th className="py-3 px-3">Unit</th>
              <th className="py-3 px-3">Reference</th>
              <th className="py-3 px-3">AI flag</th>
            </tr>
          </thead>
          <tbody>
            {report.parameters.map((param, index) => (
              <tr key={index} className={`${param.flag !== 'normal' ? 'bg-amber-950/20' : 'bg-slate-900'} border-b border-slate-800`}>
                <td className="py-3 px-3">{param.name}</td>
                <td className="py-3 px-3 font-semibold">{param.value}</td>
                <td className="py-3 px-3">{param.unit}</td>
                <td className="py-3 px-3">{param.low}-{param.high}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${param.flag === 'critical' ? 'bg-red-600 text-white' : param.flag === 'out-of-range' ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>
                    {param.flag === 'critical' ? 'Critical' : param.flag === 'out-of-range' ? 'Out of range' : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button className="rounded-2xl bg-slate-700 px-5 py-3" onClick={() => handleAction('Request Re-test')}>Request Re-test</button>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-emerald-600 px-5 py-3" onClick={() => handleAction('Sign & Release')} disabled={critical}>Sign & Release</button>
            <button className="rounded-2xl bg-red-600 px-5 py-3" onClick={() => handleAction('Sign & Escalate')}>Sign & Escalate</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">Confirm action</h3>
            <p className="mt-4 text-slate-400">You are signing off on this report. This action is logged and cannot be undone.</p>
            <div className="mt-4">
              <label className="block text-sm text-slate-300">Optional reason / comment</label>
              <textarea className="mt-2 w-full rounded-2xl bg-slate-800 p-3 text-slate-100" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Add context for the record" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-emerald-600 px-5 py-3" onClick={confirmAction}>Confirm</button>
              <button className="rounded-2xl bg-slate-700 px-5 py-3" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
