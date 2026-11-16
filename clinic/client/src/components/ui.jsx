export const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  return `${String(h).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
});

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric' });

export const initials = (name = '') =>
  name.replace(/^Dr\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export function StatCard({ icon: Icon, label, value, tone = 'teal' }) {
  return (
    <div className="stat">
      <div className={`stat-icon tone-${tone}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="stat-value">{value ?? '–'}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  if (!children) return null;
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Loader() {
  return <div className="loader">Loading…</div>;
}

export function Empty({ title, hint }) {
  return (
    <div className="empty">
      <strong>{title}</strong>
      {hint && <span>{hint}</span>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// rows: appointments. show: 'doctor' | 'patient' | 'both'. actions: (row) => JSX
export function AppointmentsTable({ rows, show = 'doctor', actions }) {
  if (!rows.length) return <Empty title="No appointments yet" hint="They will show up here as soon as they exist." />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {(show === 'patient' || show === 'both') && <th>Patient</th>}
            {(show === 'doctor' || show === 'both') && <th>Doctor</th>}
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a._id}>
              {(show === 'patient' || show === 'both') && (
                <td>
                  <div className="cell-main">{a.patient?.name || 'Deleted user'}</div>
                  <div className="cell-sub">{a.patient?.email}</div>
                </td>
              )}
              {(show === 'doctor' || show === 'both') && (
                <td>
                  <div className="cell-main">{a.doctor?.name || 'Deleted user'}</div>
                  <div className="cell-sub">{a.doctor?.specialization}</div>
                </td>
              )}
              <td>{fmtDate(a.appointmentDate)}</td>
              <td>{a.appointmentTime}</td>
              <td className="reason">{a.reason}</td>
              <td>
                <StatusBadge status={a.status} />
              </td>
              {actions && <td>{actions(a)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
