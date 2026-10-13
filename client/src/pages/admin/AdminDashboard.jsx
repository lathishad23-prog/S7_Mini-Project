import React, { useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { branches, technicians, pathologists, samples, activityFeed, escalationLogs, referenceRanges, notificationSettings, coldChainThresholds } from '../../mocks/adminData';
import SampleDetail from './detail/SampleDetail';
import BranchDetail from './branch/BranchDetail';

function AdminDashboard() {
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [sampleFilter, setSampleFilter] = useState('');
  const [sampleCategory, setSampleCategory] = useState('all');
  const [samplePreset, setSamplePreset] = useState('all');
  const [branchForm, setBranchForm] = useState({ name: '', address: '', capacity: '' });
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: 'technician', branch: 'North Diagnostic Center', email: '' });
  const [refs, setRefs] = useState(referenceRanges);
  const [notifications, setNotifications] = useState(notificationSettings);
  const [thresholds, setThresholds] = useState(coldChainThresholds);

  const branchOptions = [{ id: 'all', name: 'All branches' }, ...branches];
  const branchData = selectedBranch === 'all' ? branches : branches.filter((branch) => branch.id === selectedBranch);
  const chartData = branchData.map((branch) => ({ name: branch.name.replace(' Lab', ''), turnaround: branch.avgTurnaround }));
  const anomalyData = branchData[0]?.branchEvents || branches[0].branchEvents;
  const filteredSamples = useMemo(() => {
    const search = sampleFilter.trim().toLowerCase();
    const categoryMatch = {
      all: () => true,
      collected: (sample) => ['In transit', 'Delayed'].includes(sample.status),
      underReview: (sample) => sample.status === 'Awaiting sign-off',
      completed: (sample) => ['Delivered', 'Signed'].includes(sample.status)
    };

    return samples.filter((sample) => {
      if (selectedBranch !== 'all' && sample.branch !== branches.find((b) => b.id === selectedBranch)?.name) return false;
      if (!categoryMatch[sampleCategory](sample)) return false;
      if (samplePreset === 'broken' && !sample.custodyBroken) return false;
      if (samplePreset === 'delayed' && !sample.delayed) return false;
      if (samplePreset === 'critical' && !sample.critical) return false;
      if (search && !`${sample.sampleId} ${sample.patientName} ${sample.branch} ${sample.testName}`.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [sampleFilter, samplePreset, selectedBranch, sampleCategory]);

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
            <div className="rounded-3xl bg-slate-800 p-4 text-right">
              <div className="text-sm text-slate-400">Branch filter</div>
              <select value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)} className="mt-2 w-full rounded-2xl bg-slate-900 p-3 text-slate-100">
                {branchOptions.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
              </select>
            </div>
          </div>
        </header>

        <nav className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <NavLink end to="/admin" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Overview
          </NavLink>
          <NavLink to="/admin/staff" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Staff
          </NavLink>
          <NavLink to="/admin/samples" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Samples
          </NavLink>
          <NavLink to="/admin/branches" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Branches
          </NavLink>
          <NavLink to="/admin/escalations" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Escalations
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `rounded-2xl p-4 text-center ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-100 hover:bg-slate-800'}`}>
            Settings
          </NavLink>
        </nav>

        <Routes>
            <Route index element={<Overview branchData={branchData} chartData={chartData} anomalyData={anomalyData} activityFeed={activityFeed} selectedBranch={selectedBranch} technicians={technicians} />} />
          <Route path="staff" element={<StaffManagement technicians={technicians} pathologists={pathologists} selectedBranch={selectedBranch} staffModalOpen={staffModalOpen} setStaffModalOpen={setStaffModalOpen} newStaff={newStaff} setNewStaff={setNewStaff} />} />
          <Route path="samples" element={<SamplesTable filteredSamples={filteredSamples} sampleFilter={sampleFilter} setSampleFilter={setSampleFilter} sampleCategory={sampleCategory} setSampleCategory={setSampleCategory} samplePreset={samplePreset} setSamplePreset={setSamplePreset} />} />
          <Route path="samples/detail/:id" element={<SampleDetail />} />
          <Route path="branches" element={<BranchesView branches={branches} />} />
          <Route path="branches/:id" element={<BranchDetail branches={branches} />} />
          <Route path="escalations" element={<EscalationLog logs={escalationLogs} />} />
          <Route path="settings" element={<Settings refs={refs} setRefs={setRefs} notifications={notifications} setNotifications={setNotifications} thresholds={thresholds} setThresholds={setThresholds} />} />
        </Routes>
      </div>
    </div>
  );
}

function Overview({ branchData, chartData, anomalyData, activityFeed, selectedBranch, technicians }) {
  const branchTechs = selectedBranch === 'all'
    ? technicians
    : technicians.filter((tech) => tech.branch === branches.find((b) => b.id === selectedBranch)?.name);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {branchData.slice(0, 4).map((branch) => (
          <div key={branch.id} className="rounded-3xl bg-slate-900 p-6">
            <div className="text-sm text-slate-400">{branch.name}</div>
            <div className="mt-4 text-3xl font-semibold">{branch.avgTurnaround}h</div>
            <div className="mt-2 text-slate-300">Avg turnaround</div>
            <div className="mt-4 grid gap-2 text-sm text-slate-400">
              <div>In transit: {branch.samplesInTransit}</div>
              <div>Critical alerts: {branch.criticalAlerts}</div>
              <div>Integrity: {branch.integrity}%</div>
            </div>
          </div>
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Turnaround by branch</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} aria-label="Average turnaround by branch">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="turnaround" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI-flagged anomalies</h2>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={anomalyData} aria-label="AI flagged anomalies over the last 7 days">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="anomalies" stroke="#f87171" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Branch performance</h2>
            <span className="text-sm text-slate-400">{selectedBranch === 'all' ? 'All branches' : branchData[0]?.name}</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Branch</th><th className="px-3">Turnaround</th><th className="px-3">Integrity</th><th className="px-3">In transit</th><th className="px-3">Cold chain</th></tr></thead>
              <tbody>
                {branchData.map((branch) => (
                  <tr key={branch.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                    <td className="py-3 px-3">{branch.name}</td>
                    <td className="px-3">{branch.avgTurnaround}h</td>
                    <td className="px-3">{branch.integrity}%</td>
                    <td className="px-3">{branch.samplesInTransit}</td>
                    <td className="px-3">{branch.coldChainBreaches}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Individual staff performance</h2>
            <span className="text-sm text-slate-400">Technicians only</span>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Technician</th><th className="px-3">Branch</th><th className="px-3">Collected</th><th className="px-3">Workload</th><th className="px-3">Waiting</th><th className="px-3">Shift</th></tr></thead>
              <tbody>
                {branchTechs.map((tech) => (
                  <tr key={tech.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                    <td className="py-3 px-3">{tech.name}</td>
                    <td className="px-3">{tech.branch}</td>
                    <td className="px-3">{tech.todayCollected}</td>
                    <td className="px-3">{tech.workload}</td>
                    <td className="px-3">{tech.waiting}</td>
                    <td className="px-3">{tech.shift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Live activity</h2>
          <span className="text-sm text-slate-400">Read-only operational events</span>
        </div>
        <div className="mt-4 space-y-3">
          {activityFeed.map((event) => (
            <div key={event.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm text-slate-400">{new Date(event.ts).toLocaleString()} • {event.branch}</div>
              <div className="mt-1 text-slate-100">{event.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StaffManagement({ technicians, pathologists, selectedBranch, staffModalOpen, setStaffModalOpen, newStaff, setNewStaff }) {
  const filteredTechnicians = useMemo(() => {
    return selectedBranch === 'all' ? technicians : technicians.filter((tech) => tech.branch === branches.find((b) => b.id === selectedBranch)?.name);
  }, [technicians, selectedBranch]);

  const filteredPathologists = useMemo(() => {
    return selectedBranch === 'all' ? pathologists : pathologists.filter((path) => path.branch === branches.find((b) => b.id === selectedBranch)?.name);
  }, [pathologists, selectedBranch]);

  const branchSummaries = useMemo(() => {
    const names = Array.from(new Set([...filteredTechnicians.map((tech) => tech.branch), ...filteredPathologists.map((path) => path.branch)]));
    return names.map((name) => {
      const techs = filteredTechnicians.filter((tech) => tech.branch === name);
      const paths = filteredPathologists.filter((path) => path.branch === name);
      return {
        name,
        techs,
        paths,
        techCount: techs.length,
        pathCount: paths.length,
        collected: techs.reduce((sum, tech) => sum + tech.todayCollected, 0),
        workload: techs.reduce((sum, tech) => sum + tech.workload, 0),
        onDuty: techs.filter((tech) => tech.onDuty).length + paths.filter((path) => path.onDuty).length
      };
    });
  }, [filteredTechnicians, filteredPathologists]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Technician & pathologist management</h2>
            <p className="mt-2 text-slate-400">Review staff details by branch, duty status, and collection performance.</p>
          </div>
          <button className="rounded-2xl bg-amber-500 px-5 py-3 text-slate-950" onClick={() => setStaffModalOpen(true)}>Add staff</button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {branchSummaries.map((branch) => (
          <div key={branch.name} className="rounded-3xl bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">{branch.name}</p>
                <h3 className="mt-2 text-xl font-semibold">Branch summary</h3>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{branch.onDuty} on duty</span>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <div>Technicians: {branch.techCount}</div>
              <div>Pathologists: {branch.pathCount}</div>
              <div>Samples collected today: {branch.collected}</div>
              <div>Total technician workload: {branch.workload}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Technicians</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Name</th><th className="px-3">Branch</th><th className="px-3">Collected</th><th className="px-3">Workload</th><th className="px-3">Shift</th><th className="px-3">Status</th></tr></thead>
              <tbody>
                {filteredTechnicians.map((tech) => (
                  <tr key={tech.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                    <td className="py-3 px-3">{tech.name}</td>
                    <td className="px-3">{tech.branch}</td>
                    <td className="px-3">{tech.todayCollected}</td>
                    <td className="px-3">{tech.workload}</td>
                    <td className="px-3">{tech.shift}</td>
                    <td className="px-3"><button className={`rounded-full px-3 py-1 text-xs ${tech.onDuty ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>{tech.onDuty ? 'On duty' : 'Off duty'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-lg font-semibold">Pathologists</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Name</th><th className="px-3">Branch</th><th className="px-3">Signed today</th><th className="px-3">Avg sign time</th><th className="px-3">Pending critical</th><th className="px-3">Status</th></tr></thead>
              <tbody>
                {filteredPathologists.map((path) => (
                  <tr key={path.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                    <td className="py-3 px-3">{path.name}</td>
                    <td className="px-3">{path.branch}</td>
                    <td className="px-3">{path.signedToday}</td>
                    <td className="px-3">{path.avgSignTime}h</td>
                    <td className="px-3">{path.pendingCritical}</td>
                    <td className="px-3"><button className={`rounded-full px-3 py-1 text-xs ${path.onDuty ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-200'}`}>{path.onDuty ? 'On duty' : 'Off duty'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SamplesTable({ filteredSamples, sampleFilter, setSampleFilter, sampleCategory, setSampleCategory, samplePreset, setSamplePreset }) {
  const navigate = useNavigate();
  const categoryFilters = {
    all: { label: 'All samples', predicate: () => true },
    collected: { label: 'Collected', predicate: (sample) => ['In transit', 'Delayed'].includes(sample.status) },
    underReview: { label: 'Under review', predicate: (sample) => sample.status === 'Awaiting sign-off' },
    completed: { label: 'Completed', predicate: (sample) => ['Delivered', 'Signed'].includes(sample.status) }
  };

  const displayedSamples = useMemo(() => {
    return filteredSamples.filter(categoryFilters[sampleCategory].predicate);
  }, [filteredSamples, sampleCategory]);

  const counts = useMemo(() => ({
    all: filteredSamples.length,
    collected: filteredSamples.filter(categoryFilters.collected.predicate).length,
    underReview: filteredSamples.filter(categoryFilters.underReview.predicate).length,
    completed: filteredSamples.filter(categoryFilters.completed.predicate).length
  }), [filteredSamples]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          <input value={sampleFilter} onChange={(e) => setSampleFilter(e.target.value)} placeholder="Search samples, branch, patient" className="rounded-3xl bg-slate-800 p-4 text-slate-100" />
          <select value={samplePreset} onChange={(e) => setSamplePreset(e.target.value)} className="rounded-3xl bg-slate-800 p-4 text-slate-100">
            <option value="all">All samples</option>
            <option value="broken">Broken custody chain</option>
            <option value="delayed">Delayed</option>
            <option value="critical">Critical — pending sign-off</option>
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {Object.entries(categoryFilters).map(([key, category]) => (
            <button key={key} type="button" onClick={() => setSampleCategory(key)} className={`rounded-3xl p-4 text-left ${sampleCategory === key ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>
              <div className="text-sm font-semibold">{category.label}</div>
              <div className="mt-2 text-3xl font-semibold text-slate-100">{counts[key]}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="overflow-x-auto rounded-3xl bg-slate-900 p-6">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Sample</th><th className="px-3">Patient</th><th className="px-3">Branch</th><th className="px-3">Status</th><th className="px-3">Integrity</th><th className="px-3">Flag</th></tr></thead>
          <tbody>
            {displayedSamples.map((sample) => (
              <tr key={sample.id} className="cursor-pointer border-b border-slate-800 hover:bg-slate-950/50" onClick={() => navigate(`/admin/samples/detail/${sample.id}`)}>
                <td className="py-3 px-3">{sample.sampleId}</td>
                <td className="px-3">{sample.patientName}</td>
                <td className="px-3">{sample.branch}</td>
                <td className="px-3">{sample.status}</td>
                <td className={`px-3 font-semibold ${sample.integrity === 'Pass' ? 'text-emerald-300' : 'text-red-400'}`}>{sample.integrity}</td>
                <td className={`px-3 font-semibold ${sample.critical ? 'text-red-400' : sample.delayed ? 'text-amber-300' : 'text-slate-300'}`}>{sample.flag}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BranchesView({ branches }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {branches.map((branch) => (
          <Link key={branch.id} to={`/admin/branches/${branch.id}`} className="rounded-3xl bg-slate-900 p-6 hover:border hover:border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{branch.name}</h3>
                <p className="mt-1 text-slate-400">{branch.address}</p>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{branch.technicians} techs</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
              <div>Avg turnaround: {branch.avgTurnaround}h</div>
              <div>In transit: {branch.samplesInTransit}</div>
              <div>Integrity: {branch.integrity}%</div>
              <div>Breaches: {branch.coldChainBreaches}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function EscalationLog({ logs }) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [branch, setBranch] = useState('all');

  const filtered = useMemo(() => logs.filter((log) => {
    const created = new Date(log.timestamp);
    if (dateFrom && created < new Date(dateFrom)) return false;
    if (dateTo && created > new Date(dateTo)) return false;
    if (branch !== 'all' && log.branch !== branch) return false;
    return true;
  }), [logs, dateFrom, dateTo, branch]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <div className="grid gap-4 lg:grid-cols-4">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-3xl bg-slate-800 p-4 text-slate-100" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-3xl bg-slate-800 p-4 text-slate-100" />
          <select value={branch} onChange={(e) => setBranch(e.target.value)} className="rounded-3xl bg-slate-800 p-4 text-slate-100">
            <option value="all">All branches</option>
            {branches.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
          <button onClick={() => console.log('Export CSV stub')} className="rounded-3xl bg-amber-500 px-5 py-3 text-slate-950">Export CSV</button>
        </div>
      </section>
      <div className="overflow-x-auto rounded-3xl bg-slate-900 p-6">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Timestamp</th><th className="px-3">Patient</th><th className="px-3">Parameter</th><th className="px-3">Pathologist</th><th className="px-3">Doctor</th><th className="px-3">Confirmed</th></tr></thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                <td className="py-3 px-3">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-3">{log.patientName}</td>
                <td className="px-3">{log.parameter}</td>
                <td className="px-3">{log.pathologist}</td>
                <td className="px-3">{log.doctorNotified}</td>
                <td className="px-3 text-emerald-300">{log.deliveryConfirmed ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Settings({ refs, setRefs, notifications, setNotifications, thresholds, setThresholds }) {
  const handleRefChange = (id, field, value) => setRefs((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  const handleThresholdChange = (id, field, value) => setThresholds((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: Number(value) } : item)));

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Reference range management</h2>
        <p className="mt-2 text-slate-400">These thresholds affect AI flagging logic for incoming samples.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 text-slate-400"><tr><th className="py-3 px-3">Test</th><th className="px-3">Normal</th><th className="px-3">Critical</th></tr></thead>
            <tbody>
              {refs.map((ref) => (
                <tr key={ref.id} className="border-b border-slate-800 hover:bg-slate-950/50">
                  <td className="py-3 px-3">{ref.testType}</td>
                  <td className="px-3"><input value={ref.normal} onChange={(e) => handleRefChange(ref.id, 'normal', e.target.value)} className="w-full rounded-2xl bg-slate-800 p-2 text-slate-100" /></td>
                  <td className="px-3"><input value={ref.critical} onChange={(e) => handleRefChange(ref.id, 'critical', e.target.value)} className="w-full rounded-2xl bg-slate-800 p-2 text-slate-100" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">Notification channels</h3>
          <div className="mt-4 space-y-3">
            {['sms', 'whatsapp', 'voice'].map((channel) => (
              <label key={channel} className="flex items-center gap-3 rounded-2xl bg-slate-800 p-4">
                <input type="checkbox" checked={notifications[channel]} onChange={(e) => setNotifications((prev) => ({ ...prev, [channel]: e.target.checked }))} />
                <span className="text-slate-200">Enable {channel.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="rounded-3xl bg-slate-900 p-6">
          <h3 className="text-xl font-semibold">Cold-chain thresholds</h3>
          <div className="mt-4 space-y-3">
            {thresholds.map((threshold) => (
              <div key={threshold.id} className="grid gap-3 md:grid-cols-3">
                <div>{threshold.sampleType}</div>
                <input type="number" value={threshold.min} onChange={(e) => handleThresholdChange(threshold.id, 'min', e.target.value)} className="rounded-2xl bg-slate-800 p-2 text-slate-100" />
                <input type="number" value={threshold.max} onChange={(e) => handleThresholdChange(threshold.id, 'max', e.target.value)} className="rounded-2xl bg-slate-800 p-2 text-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-3xl bg-slate-900 p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-4 text-3xl font-semibold text-amber-300">{value}</p>
    </div>
  );
}

export default AdminDashboard;
