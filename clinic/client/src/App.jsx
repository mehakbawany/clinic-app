import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, homePath } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import MyAppointments from './pages/MyAppointments.jsx';
import AppointmentRequests from './pages/AppointmentRequests.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import AllAppointments from './pages/AllAppointments.jsx';

const guard = (role) => (
  <ProtectedRoute roles={[role]}>
    <Layout />
  </ProtectedRoute>
);

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? homePath[user.role] : '/login'} replace />} />
      <Route path="/login" element={user ? <Navigate to={homePath[user.role]} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={homePath[user.role]} replace /> : <Register />} />

      <Route element={guard('patient')}>
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
      </Route>

      <Route element={guard('doctor')}>
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/requests" element={<AppointmentRequests />} />
      </Route>

      <Route element={guard('admin')}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/appointments" element={<AllAppointments />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
