import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { Alert, Empty, Loader, initials } from './ui.jsx';

export default function DoctorList({ limit }) {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/doctors', { params: { search } });
        setDoctors(data);
        setError('');
      } catch (e) {
        setError(errMsg(e));
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const shown = limit ? doctors.slice(0, limit) : doctors;

  return (
    <div>
      <div className="search">
        <Search size={18} />
        <input placeholder="Search by doctor name or specialization" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Alert>{error}</Alert>
      {loading ? (
        <Loader />
      ) : shown.length === 0 ? (
        <Empty title="No doctors found" hint="Try a different name or specialization." />
      ) : (
        <div className="doctor-grid">
          {shown.map((d) => (
            <div className="doctor-card" key={d._id}>
              <div className="avatar lg">{initials(d.name)}</div>
              <h3>{d.name}</h3>
              <p className="spec">{d.specialization}</p>
              <p className="exp">
                <Briefcase size={14} /> {d.experience} {d.experience === 1 ? 'year' : 'years'} experience
              </p>
              <button className="btn btn-primary btn-block" onClick={() => navigate(`/book?doctor=${d._id}`)}>
                Book appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
