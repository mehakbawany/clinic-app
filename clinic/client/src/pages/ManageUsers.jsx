import { useState } from 'react';
import { PageHeader } from '../components/ui.jsx';
import AddDoctorForm from '../components/AddDoctorForm.jsx';
import UserManagement from '../components/UserManagement.jsx';

export default function ManageUsers() {
  const [tick, setTick] = useState(0);
  return (
    <>
      <PageHeader title="Manage users" subtitle="Add doctors, activate or deactivate accounts, and remove users." />
      <AddDoctorForm onAdded={() => setTick((t) => t + 1)} />
      <section className="section">
        <UserManagement key={tick} />
      </section>
    </>
  );
}
