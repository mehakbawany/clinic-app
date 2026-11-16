import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Stethoscope, CalendarDays } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, AppointmentsTable, Loader, PageHeader, StatCard } from '../components/ui.jsx';
import AddDoctorForm from '../components/AddDoctorForm.jsx';
import UserManagement from '../components/UserManagement.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appts, setAppts] = useState(null);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/appointments')])
      .then(([s, a]) => {
        setStats(s.data);
        setAppts(a.data);
      })
      .catch((e) => setError(errMsg(e)));
  }, [tick]);

  const refresh = () => setTick((t) => t + 1);

  return (
    <>
      <PageHeader title="Clinic overview" subtitle="Everything happening across patients, doctors and appointments." />
      <Alert>{error}</Alert>
      {!stats ? (
        <Loader />
      ) : (
        <div className="stats">
          <StatCard icon={Users} label="Patients" value={stats.patients} />
          <StatCard icon={Stethoscope} label="Doctors" value={stats.doctors} tone="sage" />
          <StatCard icon={CalendarDays} label="Appointments" value={stats.appointments} tone="navy" />
        </div>
      )}
      <section className="section">
        <AddDoctorForm onAdded={refresh} />
      </section>
      <section className="section">
        <UserManagement key={tick} onChange={refresh} />
      </section>
      <section className="section">
        <div className="card-head">
          <h2 className="card-title">Recent appointments</h2>
          <Link to="/admin/appointments" className="link">View all</Link>
        </div>
        {appts && (
          <div className="card flush">
            <AppointmentsTable rows={appts.slice(0, 8)} show="both" />
          </div>
        )}
      </section>
    </>
  );
}
