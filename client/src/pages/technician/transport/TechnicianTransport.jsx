import React, { useMemo, useState } from 'react';
import { collections, safeRange } from '../../../mocks/technicianData';

function temperatureClass(temp) {
  if (temp < safeRange.min || temp > safeRange.max) return 'text-red-300';
  return 'text-emerald-300';
}

export default function TechnicianTransport() {
  const inTransit = useMemo(() => collections.filter((item) => item.status === 'in_transit'), []);
  const [items, setItems] = useState(inTransit);

  function simulateReading(id) {
    setItems((current) => current.map((item) => {
      if (item.id !== id) return item;
      const temperature = Number((Math.random() * 6 + 2).toFixed(1));
      const humidity = Number((Math.random() * 20 + 55).toFixed(0));
      const newReading = { ts: Date.now(), temperature, humidity };
      return {
        ...item,
        readings: [...(item.readings || []), newReading],
        ledger: [...(item.ledger || []), { ts: Date.now(), event: 'sensor', text: `Temp ${temperature}°C`, hash: 'simhash' }]
      };
    }));
  }

  function markDelivered(id) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: 'delivered', ledger: [...item.ledger, { ts: Date.now(), event: 'delivered', text: 'Delivered to lab', hash: 'ddhash' }] } : item));
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-2xl font-semibold">Transport & cold-chain logging</h2>
        <p className="mt-2 text-slate-400">Manage samples in transit, log temperature readings, and mark delivery to lab.</p>
      </section>
      {items.length === 0 ? (
        <div className="rounded-3xl bg-slate-900 p-6 text-slate-400">No in-transit samples assigned right now.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const last = item.readings?.[item.readings.length - 1];
            return (
              <div key={item.id} className="rounded-3xl bg-slate-900 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-slate-400">{item.sampleId} • {item.testName}</div>
                    <h3 className="mt-2 text-xl font-semibold">{item.patientName}</h3>
                    <div className="mt-1 text-slate-300">{item.address}</div>
                  </div>
                  <span className="inline-flex rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">In transit</span>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Latest temperature</div>
                    <div className={`mt-2 text-lg font-semibold ${temperatureClass(last?.temperature ?? safeRange.min)}`}>{last ? `${last.temperature}°C` : 'No reading'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Humidity</div>
                    <div className="mt-2 text-lg font-semibold text-slate-100">{last ? `${last.humidity}%` : '-'}</div>
                  </div>
                  <div className="rounded-2xl bg-slate-800 p-4">
                    <div className="text-sm text-slate-400">Safe range</div>
                    <div className="mt-2 text-lg font-semibold text-slate-100">{safeRange.min}–{safeRange.max}°C</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button className="rounded-2xl bg-sky-600 px-4 py-3" onClick={() => simulateReading(item.id)}>Simulate reading</button>
                  <button className="rounded-2xl bg-emerald-600 px-4 py-3" onClick={() => markDelivered(item.id)}>Mark delivered to lab</button>
                </div>
                <div className="mt-4 rounded-3xl bg-slate-800 p-4 text-sm text-slate-400">{'// TODO: replace simulated sensor logs with POST /samples/{id}/readings and /samples/{id}/deliver API calls.'}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
