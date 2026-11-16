import { useEffect, useState } from 'react';
import api, { errMsg } from '../api.js';
import { Alert, Loader, PageHeader } from '../components/ui.jsx';
import RequestsTable from '../components/RequestsTable.jsx';

const FILTERS = ['all', 'pending', 'approved', 'rejected', 'cancelled'];

export default function AppointmentRequests() {
  const [appts, setAppts] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const load = () => api.get('/appointments/doctor').then((r) => setAppts(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => {
    load();
  }, []);

  const rows = appts ? (filter === 'all' ? appts : appts.filter((a) => a.status === filter)) : [];

  return (
    <>
      <PageHeader title="Appointment requests" subtitle="Approve or reject requests assigned to you." />
      <Alert>{error}</Alert>
      <div className="tabs spaced">
        {FILTERS.map((f) => (
          <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
            {appts && <span className="tab-count">{f === 'all' ? appts.length : appts.filter((a) => a.status === f).length}</span>}
          </button>
        ))}
      </div>
      {!appts ? (
        <Loader />
      ) : (
        <div className="card flush">
          <RequestsTable rows={rows} onChange={load} />
        </div>
      )}
    </>
  );
}
