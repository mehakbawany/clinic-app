import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert } from './ui.jsx';

const blank = { name: '', email: '', password: '', specialization: '', experience: '' };

export default function AddDoctorForm({ onAdded }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    try {
      setBusy(true);
      const { data } = await api.post('/admin/doctors', form);
      setOk(`${data.name} was added as a doctor.`);
      setForm(blank);
      onAdded && onAdded();
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card form-grid" onSubmit={submit}>
      <h2 className="card-title full">Add a doctor</h2>
      <Alert>{error}</Alert>
      <Alert type="success">{ok}</Alert>
      <label>
        Full name
        <input value={form.name} onChange={set('name')} placeholder="Dr. Ahmed" required />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={set('email')} placeholder="ahmed@clinic.com" required />
      </label>
      <label>
        Temporary password
        <input type="password" value={form.password} onChange={set('password')} minLength={6} placeholder="At least 6 characters" required />
      </label>
      <label>
        Specialization
        <input value={form.specialization} onChange={set('specialization')} placeholder="Cardiologist" required />
      </label>
      <label>
        Experience (years)
        <input type="number" min="0" value={form.experience} onChange={set('experience')} placeholder="5" required />
      </label>
      <div className="form-end">
        <button className="btn btn-primary" disabled={busy}>
          <UserPlus size={16} /> {busy ? 'Adding…' : 'Add doctor'}
        </button>
      </div>
    </form>
  );
}
