import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, AppointmentsTable, Loader, PageHeader, StatCard } from '../components/ui.jsx';
import DoctorList from '../components/DoctorList.jsx';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appts, setAppts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/appointments/my').then((r) => setAppts(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const count = (s) => appts.filter((a) => a.status === s).length;

  return (
    <>
      <PageHeader title={`Welcome, ${user.name.split(' ')[0]}`} subtitle="Here is where your care stands today." />
      <Alert>{error}</Alert>
      {!appts ? (
        <Loader />
      ) : (
        <div className="stats">
          <StatCard icon={CalendarDays} label="Total appointments" value={appts.length} />
          <StatCard icon={Clock} label="Pending" value={count('pending')} tone="amber" />
          <StatCard icon={CheckCircle2} label="Approved" value={count('approved')} tone="sage" />
        </div>
      )}

      <section className="section">
        <div className="card-head">
          <h2 className="card-title">Find a doctor</h2>
        </div>
        <DoctorList limit={6} />
      </section>

      <section className="section">
        <div className="card-head">
          <h2 className="card-title">Recent appointments</h2>
          <Link to="/my-appointments" className="link">View all</Link>
        </div>
        {appts && (
          <div className="card flush">
            <AppointmentsTable rows={appts.slice(0, 5)} show="doctor" />
          </div>
        )}
      </section>
    </>
  );
}
