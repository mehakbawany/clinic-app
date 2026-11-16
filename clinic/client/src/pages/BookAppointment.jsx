import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, PageHeader, TIME_SLOTS, initials } from '../components/ui.jsx';

export default function BookAppointment() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctor: params.get('doctor') || '', appointmentDate: '', appointmentTime: '', reason: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/doctors').then((r) => setDoctors(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const selected = doctors.find((d) => d._id === form.doctor);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setBusy(true);
      await api.post('/appointments', form);
      navigate('/my-appointments', { state: { booked: true } });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Book an appointment" subtitle="Choose a doctor, a day and a time. The doctor will confirm your request." />
      <div className="book-layout">
        <form className="card form-grid" onSubmit={submit}>
          <Alert>{error}</Alert>
          <label className="full">
            Doctor
            <select value={form.doctor} onChange={set('doctor')} required>
              <option value="">Select a doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} — {d.specialization}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date
            <input type="date" min={today} value={form.appointmentDate} onChange={set('appointmentDate')} required />
          </label>
          <label>
            Time
            <select value={form.appointmentTime} onChange={set('appointmentTime')} required>
              <option value="">Select a time</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="full">
            Reason for visit
            <textarea rows={4} value={form.reason} onChange={set('reason')} placeholder="Briefly describe your symptoms or the purpose of the visit" required />
          </label>
          <div className="form-end">
            <button className="btn btn-primary" disabled={busy}>
              {busy ? 'Sending request…' : 'Request appointment'}
            </button>
          </div>
        </form>

        <aside className="card doctor-preview">
          {selected ? (
            <>
              <div className="avatar lg">{initials(selected.name)}</div>
              <h3>{selected.name}</h3>
              <p className="spec">{selected.specialization}</p>
              <p className="exp">
                <Briefcase size={14} /> {selected.experience} years experience
              </p>
              <p className="muted">{selected.email}</p>
            </>
          ) : (
            <p className="muted">Pick a doctor to see their details here.</p>
          )}
        </aside>
      </div>
    </>
  );
}
