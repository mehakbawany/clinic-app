import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, CalendarCheck, ClipboardList, Users, CalendarDays, LogOut, Menu, X, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from './ui.jsx';

const NAV = {
  patient: [
    { to: '/patient', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/book', label: 'Book Appointment', icon: CalendarPlus },
    { to: '/my-appointments', label: 'My Appointments', icon: CalendarCheck },
  ],
  doctor: [
    { to: '/doctor', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/requests', label: 'Appointment Requests', icon: ClipboardList },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Manage Users', icon: Users },
    { to: '/admin/appointments', label: 'All Appointments', icon: CalendarDays },
  ],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <HeartPulse size={24} />
          <span>CareLine</span>
        </div>
        <nav>
          {NAV[user.role].map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-user">
          <div className="avatar">{initials(user.name)}</div>
          <div className="side-user-info">
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </div>
          <button className="icon-btn" onClick={onLogout} title="Log out" aria-label="Log out">
            <LogOut size={18} />
          </button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="topbar-brand">CareLine</span>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
