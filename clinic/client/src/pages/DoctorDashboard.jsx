import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle2, XCircle, Briefcase } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Empty, Loader, PageHeader, StatCard, initials } from '../components/ui.jsx';
import RequestsTable from '../components/RequestsTable.jsx';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appts, setAppts] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/appointments/doctor').then((r) => setAppts(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => {
    load();
  }, []);

  const count = (s) => appts.filter((a) => a.status === s).length;
  const pending = appts ? appts.filter((a) => a.status === 'pending') : [];

  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} subtitle="Review the requests waiting for you." />
      <div className="card profile">
        <div className="avatar lg">{initials(user.name)}</div>
        <div>
          <h3>{user.name}</h3>
          <p className="spec">{user.specialization}</p>
          <p className="exp">
            <Briefcase size={14} /> {user.experience} years experience · {user.email}
          </p>
        </div>
      </div>
      <Alert>{error}</Alert>
      {!appts ? (
        <Loader />
      ) : (
        <>
          <div className="stats four">
            <StatCard icon={CalendarDays} label="Total appointments" value={appts.length} />
            <StatCard icon={Clock} label="Pending requests" value={count('pending')} tone="amber" />
            <StatCard icon={CheckCircle2} label="Approved" value={count('approved')} tone="sage" />
            <StatCard icon={XCircle} label="Rejected" value={count('rejected')} tone="rose" />
          </div>
          <section className="section">
            <div className="card-head">
              <h2 className="card-title">Pending requests</h2>
              <Link to="/requests" className="link">All requests</Link>
            </div>
            <div className="card flush">
              {pending.length ? <RequestsTable rows={pending} onChange={load} /> : <Empty title="You're all caught up" hint="New requests will appear here." />}
            </div>
          </section>
        </>
      )}
    </>
  );
}
