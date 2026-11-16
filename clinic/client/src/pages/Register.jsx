import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { useAuth, homePath } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';
import { Alert } from '../components/ui.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setBusy(true);
      const user = await register(form);
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
        <h1>See a doctor without the waiting room.</h1>
        <p>Create a patient account to find specialists and request an appointment in under a minute.</p>
      </div>
      <form className="auth-card" onSubmit={submit}>
        <h2>Create your account</h2>
        <p className="muted">Patient registration</p>
        <Alert>{error}</Alert>
        <label>
          Full name
          <input value={form.name} onChange={set('name')} required autoFocus />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={set('email')} required />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={set('password')} minLength={6} placeholder="At least 6 characters" required />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
        <p className="muted center">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
