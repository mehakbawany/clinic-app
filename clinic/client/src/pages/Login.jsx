import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuth, homePath } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';
import { Alert } from '../components/ui.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setBusy(true);
      const user = await login(form.email, form.password);
      navigate(homePath[user.role]);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-hero">
        <HeartPulse size={34} />
        <h1>Care that fits your calendar.</h1>
        <p>Book visits, approve requests and run your clinic from one calm, simple workspace.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue.</p>
        <Alert>{error}</Alert>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoFocus />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="muted center">
          New patient? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
