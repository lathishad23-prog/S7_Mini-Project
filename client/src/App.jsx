import { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import PatientDashboard from './pages/patient/PatientDashboard';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import PathologistDashboard from './pages/pathologist/PathologistDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const api = (path, options = {}) => fetch(`/api${path}`, {
  ...options,
  headers: {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }
}).then(async (res) => {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data;
});

function getRolePath(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'technician':
      return '/technician';
    case 'pathologist':
      return '/pathologist';
    case 'patient':
    default:
      return '/patient';
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [samples, setSamples] = useState([]);
  const [summary, setSummary] = useState({});
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    api('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        const currentUser = response?.user || null;
        setUser(currentUser);
        if (currentUser?.role) {
          const rolePath = getRolePath(currentUser.role);
          const isMatchingRoute = location.pathname.startsWith(rolePath);
          const target = isMatchingRoute ? location.pathname : rolePath;
          navigate(target, { replace: true });
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        navigate('/', { replace: true });
      });
  }, [token, navigate, location.pathname]);

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError('');
    const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';

    try {
      const response = await api(endpoint, {
        method: 'POST',
        body: JSON.stringify(form)
      });

      if (response?.token) {
        const currentUser = response.user || { role: form.role };
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(currentUser);
        setForm({ name: '', email: '', password: '', role: 'patient' });
        setAuthError('');
        window.location.assign(getRolePath(currentUser.role));
      } else {
        setAuthError('Authentication failed. Please try again.');
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed. Please try again.');
    }
  }

  async function loadSamples() {
    try {
      const data = await api('/samples', { headers: { Authorization: `Bearer ${token}` } });
      setSamples(Array.isArray(data) ? data : []);
    } catch {
      setSamples([]);
    }
  }

  async function loadSummary() {
    try {
      const data = await api('/dashboard/summary', { headers: { Authorization: `Bearer ${token}` } });
      setSummary(data && typeof data === 'object' ? data : {});
    } catch {
      setSummary({});
    }
  }

  useEffect(() => {
    if (!token || !user) return;

    if (user.role === 'technician') {
      loadSamples();
      setSummary({});
    } else if (user.role === 'admin') {
      loadSamples();
      loadSummary();
    } else {
      setSamples([]);
      setSummary({});
    }
  }, [token, user]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl rounded-3xl bg-slate-900/80 p-8 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold">LabSync AI</h1>
              <p className="mt-4 text-slate-300">Clinical laboratory sample tracking with AI-assisted validation and chain-of-custody integrity.</p>
              <div className="mt-8 space-y-3 text-sm text-slate-200">
                <div>• Book samples and receive unique IDs</div>
                <div>• Track cold-chain readings and custody events</div>
                <div>• Review anomaly flags and delivery readiness</div>
              </div>
            </div>
            <form onSubmit={handleAuth} className="rounded-2xl bg-slate-800 p-6">
              <div className="flex gap-2 mb-4">
                <button type="button" className={`flex-1 rounded px-3 py-2 ${authMode === 'login' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setAuthMode('login')}>Login</button>
                <button type="button" className={`flex-1 rounded px-3 py-2 ${authMode === 'register' ? 'bg-blue-600' : 'bg-slate-700'}`} onClick={() => setAuthMode('register')}>Register</button>
              </div>
              {authMode === 'register' && <input className="w-full mb-3 rounded p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
              <input className="w-full mb-3 rounded p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="w-full mb-3 rounded p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              {authMode === 'register' && (
                <select className="w-full mb-3 rounded p-2" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="patient">Patient</option>
                  <option value="technician">Technician</option>
                  <option value="pathologist">Pathologist</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              {authError && <p className="mb-3 text-sm text-red-400">{authError}</p>}
              <button className="w-full rounded bg-emerald-600 px-3 py-2" type="submit">{authMode === 'login' ? 'Sign in' : 'Create account'}</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 flex flex-wrap items-center justify-between rounded-2xl bg-slate-900 p-4">
          <div>
            <h2 className="text-xl font-semibold">LabSync AI</h2>
            <p className="text-sm text-slate-400">Clinical lab sample management</p>
          </div>
          <div className="flex gap-3">
            {user?.role && <Link className="rounded bg-slate-800 px-3 py-2" to={getRolePath(user.role)}>Open workspace</Link>}
            <button className="rounded bg-red-600 px-3 py-2" onClick={() => { localStorage.removeItem('token'); setToken(''); setUser(null); setForm({ name: '', email: '', password: '', role: 'patient' }); }}>Logout</button>
          </div>
        </nav>
        <Routes>
          <Route path="/patient/*" element={<PatientDashboard user={user} />} />
          <Route path="/technician/*" element={<TechnicianDashboard />} />
          <Route path="/pathologist/*" element={<PathologistDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Navigate to={getRolePath(user?.role)} replace />} />
          <Route path="*" element={<Navigate to={getRolePath(user?.role)} replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Patient dashboard is implemented in `client/src/pages/patient/PatientDashboard.jsx`
// to keep patient-specific UI grouped. See that file for the full implementation.

function Card({ title, value }) {
  return <div className="rounded-2xl bg-slate-900 p-4"><p className="text-sm text-slate-400">{title}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}

export default App;
