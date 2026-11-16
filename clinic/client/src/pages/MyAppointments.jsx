import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { Alert, AppointmentsTable, Loader, PageHeader } from '../components/ui.jsx';

export default function MyAppointments() {
  const location = useLocation();
  const [appts, setAppts] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/appointments/my').then((r) => setAppts(r.data)).catch((e) => setError(errMsg(e)));
  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment request?')) return;
    try {
      setError('');
      await api.patch(`/appointments/${id}/cancel`);
      await load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <>
      <PageHeader title="My appointments" subtitle="Track the status of every request.">
        <Link to="/book" className="btn btn-primary">Book appointment</Link>
      </PageHeader>
      {location.state?.booked && <Alert type="success">Request sent. You will see it as Approved once the doctor confirms.</Alert>}
      <Alert>{error}</Alert>
      {!appts ? (
        <Loader />
      ) : (
        <div className="card flush">
          <AppointmentsTable
            rows={appts}
            show="doctor"
            actions={(a) =>
              a.status === 'pending' ? (
                <button className="btn btn-sm btn-danger-outline" onClick={() => cancel(a._id)}>
                  Cancel
                </button>
              ) : (
                <span className="muted">—</span>
              )
            }
          />
        </div>
      )}
    </>
  );
}
