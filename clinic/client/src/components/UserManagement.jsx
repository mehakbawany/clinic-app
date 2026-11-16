import { useEffect, useState } from 'react';
import { Trash2, Power } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, Empty, Loader, fmtDate } from './ui.jsx';

export default function UserManagement({ onChange }) {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
      setError('');
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const run = async (fn) => {
    try {
      setError('');
      await fn();
      await load();
      onChange && onChange();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const toggle = (u) => run(() => api.patch(`/admin/users/${u._id}/active`));
  const remove = (u) => {
    if (window.confirm(`Delete ${u.name}? Their appointments will be removed too.`)) run(() => api.delete(`/admin/users/${u._id}`));
  };

  const shown = role === 'all' ? users : users.filter((u) => u.role === role);

  return (
    <div className="card">
      <div className="card-head">
        <h2 className="card-title">All users</h2>
        <div className="tabs">
          {['all', 'patient', 'doctor', 'admin'].map((r) => (
            <button key={r} className={`tab ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
              {r === 'all' ? 'All' : r[0].toUpperCase() + r.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Empty title="No users in this group" />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Details</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="cell-main">{u.name}</div>
                    <div className="cell-sub">{u.email}</div>
                  </td>
                  <td>
                    <span className={`badge role-${u.role}`}>{u.role}</span>
                  </td>
                  <td className="cell-sub">{u.role === 'doctor' ? `${u.specialization} · ${u.experience} yrs` : '—'}</td>
                  <td>{fmtDate(u.createdAt)}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-approved' : 'badge-rejected'}`}>{u.isActive ? 'active' : 'inactive'}</span>
                  </td>
                  <td>
                    {u.role === 'admin' ? (
                      <span className="muted">—</span>
                    ) : (
                      <div className="row-actions">
                        <button className="btn btn-sm btn-outline" onClick={() => toggle(u)}>
                          <Power size={14} /> {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-sm btn-danger-outline" onClick={() => remove(u)}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
