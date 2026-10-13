import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BarcodeScanner from 'react-qr-barcode-scanner';
import { collections, delay } from '../../../mocks/technicianData';

const safeRange = { min: 2, max: 8 };

export default function TechnicianDetail() {
  const { id } = useParams();
  const [sample, setSample] = useState(null);
  const [scanId, setScanId] = useState('');
  const [scanError, setScanError] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      await delay(200);
      if (!mounted) return;
      const found = collections.find((item) => item.id === id);
      setSample(found || null);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const matched = useMemo(() => scanId && sample ? scanId.trim().toUpperCase() === sample.sampleId : false, [scanId, sample]);

  function handleConfirm() {
    if (!sample) return;
    if (!matched) {
      setScanError('Scanned ID does not match expected sample. Please retry.');
      return;
    }

    const entry = {
      sample_id: sample.sampleId,
      event: 'collected',
      technician_id: 'tech-1',
      timestamp: new Date().toISOString(),
      location: 'GPS unavailable',
      note: note || 'No note'
    };

    sample.ledger = [...sample.ledger, { ts: Date.now(), event: 'collected', text: entry.note, hash: 'newhash123' }];
    sample.status = 'collected';
    setSuccess('Collection confirmed and ledger updated.');
    setScannerOpen(false);
    setScanError('');

    // TODO: replace with POST /collections/confirm + custody ledger update
  }

  if (!sample) {
    return <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">Sample not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
          <div>
            <h2 className="text-2xl font-semibold">{sample.patientName}</h2>
            <p className="mt-2 text-slate-400">{sample.fullPatient}</p>
          </div>
          <div className="rounded-3xl bg-slate-800 p-4 text-right">
            <div className="text-sm text-slate-400">Expected</div>
            <div className="mt-1 text-xl font-semibold">{new Date(sample.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-800 p-4">
            <div className="text-sm text-slate-400">Test</div>
            <div className="mt-2 text-lg font-semibold">{sample.testName}</div>
          </div>
          <div className="rounded-3xl bg-slate-800 p-4">
            <div className="text-sm text-slate-400">Collection type</div>
            <div className="mt-2 text-lg font-semibold">{sample.collectionType}</div>
          </div>
        </div>
        <div className="mt-5 text-slate-300">
          <p><strong>Address:</strong> {sample.address}</p>
          <p className="mt-2"><strong>Notes:</strong> {sample.notes}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">Scan sample QR code</h3>
            <p className="mt-2 text-slate-400">Use camera scanner or enter the sample ID manually.</p>
          </div>
          <button className="rounded-2xl bg-sky-600 px-4 py-2" onClick={() => setScannerOpen(!scannerOpen)}>{scannerOpen ? 'Close scanner' : 'Open scanner'}</button>
        </div>
        {scannerOpen && (
          <div className="mt-4 rounded-3xl bg-slate-800 p-4">
            <div className="text-slate-300">Point your camera at the QR code. If the browser blocks camera access, use manual entry.</div>
            <div className="mt-4 rounded-2xl border border-slate-700 bg-black p-3">
              <BarcodeScanner
                onUpdate={(err, result) => {
                  if (err) {
                    return;
                  }
                  if (result) {
                    setScanId(result.getText());
                    setScanError('');
                  }
                }}
                onError={(error) => {
                  setScanError('Camera unavailable or permission denied. Use manual entry.');
                  console.warn(error);
                }}
                width="100%"
                height={280}
                facingMode="environment"
              />
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block rounded-3xl bg-slate-800 p-4">
            <span className="text-sm text-slate-400">Sample ID</span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100"
              value={scanId}
              onChange={(e) => setScanId(e.target.value)}
              placeholder="Enter scanned sample code"
            />
          </label>
          <label className="block rounded-3xl bg-slate-800 p-4">
            <span className="text-sm text-slate-400">Field note</span>
            <textarea
              className="mt-2 h-24 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-100"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g. fasting not confirmed"
            />
          </label>
        </div>

        {scanError && <p className="mt-3 rounded-2xl bg-red-600/20 p-3 text-red-200">{scanError}</p>}
        {success && <p className="mt-3 rounded-2xl bg-emerald-600/20 p-3 text-emerald-200">{success}</p>}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="rounded-2xl bg-emerald-600 px-5 py-3 font-semibold" onClick={handleConfirm}>Confirm collection</button>
          <button className="rounded-2xl bg-slate-700 px-5 py-3" onClick={() => navigate('/technician')}>Back to task list</button>
        </div>

        <div className="mt-5 rounded-3xl bg-slate-800 p-4 text-sm text-slate-400">// TODO: replace with real camera scan and POST /collections/confirm API integration.</div>
      </div>

      <div className="rounded-3xl bg-slate-900 p-6">
        <h3 className="text-xl font-semibold">Current custody ledger</h3>
        <div className="mt-4 space-y-2">
          {sample.ledger.map((entry, index) => (
            <div key={index} className="rounded-2xl bg-slate-800 p-4">
              <div className="text-sm text-slate-500">{new Date(entry.ts).toLocaleString()}</div>
              <div className="mt-1 text-slate-100">{entry.event} — {entry.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
