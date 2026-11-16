import { useState } from 'react';
import { Check, X } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, AppointmentsTable } from './ui.jsx';

// Doctor-side table with Approve / Reject. onChange reloads parent data.
export default function RequestsTable({ rows, onChange }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const act = async (id, status) => {
    try {
      setBusy(id);
      setError('');
      await api.patch(`/appointments/${id}/status`, { status });
      await onChange();
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy('');
    }
  };

  return (
    <>
      <Alert>{error}</Alert>
      <AppointmentsTable
        rows={rows}
        show="patient"
        actions={(a) =>
          a.status === 'pending' ? (
            <div className="row-actions">
              <button className="btn btn-sm btn-success" disabled={busy === a._id} onClick={() => act(a._id, 'approved')}>
                <Check size={14} /> Approve
              </button>
              <button className="btn btn-sm btn-danger-outline" disabled={busy === a._id} onClick={() => act(a._id, 'rejected')}>
                <X size={14} /> Reject
              </button>
            </div>
          ) : (
            <span className="muted">—</span>
          )
        }
      />
    </>
  );
}
