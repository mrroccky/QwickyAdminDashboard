import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ProfessionalCard from '../components/ProfessionalCard.jsx';
import AddProfessionalForm from '../components/AddProfessionalForm.jsx';

function AllProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
         const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/professionals`);
        if (!response.ok) throw new Error('Failed to fetch professionals');
        const data = await response.json();
        setProfessionals(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProfessionals();
  }, []);

  const addProfessional = (professional) => {
    setProfessionals([...professionals, professional]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">All Professionals</h2>
          <Link to="/" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Back to Dashboard
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <section id="professionals" className="mb-8">
          {professionals.length === 0 ? (
            <p className="text-gray-500">No professionals</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((professional) => (
                <ProfessionalCard key={professional.professional_id} professional={professional} />
              ))}
            </div>
          )}
        </section>

        {showAddProfessional && (
          <AddProfessionalForm addProfessional={addProfessional} closeModal={() => setShowAddProfessional(false)} />
        )}
      </div>
    </div>
  );
}

export default AllProfessionals;