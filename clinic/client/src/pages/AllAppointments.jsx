import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, AppointmentsTable, Loader, PageHeader } from '../components/ui.jsx';

export default function AllAppointments() {
  const [appts, setAppts] = useState(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/appointments').then((r) => setAppts(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const term = q.trim().toLowerCase();
  const rows = appts ? appts.filter((a) => !term || a.patient?.name?.toLowerCase().includes(term) || a.doctor?.name?.toLowerCase().includes(term)) : [];

  return (
    <>
      <PageHeader title="All appointments" subtitle="Every booking across the clinic." />
      <Alert>{error}</Alert>
      <div className="search">
        <Search size={18} />
        <input placeholder="Search by patient or doctor name" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {!appts ? (
        <Loader />
      ) : (
        <div className="card flush">
          <AppointmentsTable rows={rows} show="both" />
        </div>
      )}
    </>
  );
}
