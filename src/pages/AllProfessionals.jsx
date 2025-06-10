import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProfessionalCard from '../components/ProfessionalCard.jsx';
import AddProfessionalForm from '../components/AddProfessionalForm.jsx';
import EditProfessionalForm from '../components/EditProfessionalForm.jsx';

function AllProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [showAddProfessional, setShowAddProfessional] = useState(false);
  const [showEditProfessional, setShowEditProfessional] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
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

  const updateProfessional = (updatedProfessional) => {
    setProfessionals(
      professionals.map((p) =>
        p.professional_id === updatedProfessional.professional_id ? updatedProfessional : p
      )
    );
  };

  const deleteProfessional = async (professionalId) => {
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/professionals/${professionalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete professional');
      setProfessionals(professionals.filter((p) => p.professional_id !== professionalId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 animate">All Professionals</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddProfessional(true)}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add Professional
            </button>
            <Link to="/" className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition duration-200">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <section id="professionals" className="mb-8">
          {professionals.length === 0 ? (
            <p className="text-gray-500">No professionals found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionals.map((professional) => (
                <ProfessionalCard
                  key={professional.professional_id}
                  professional={professional}
                  onEdit={() => {
                    setSelectedProfessional(professional);
                    setShowEditProfessional(true);
                  }}
                  onDelete={deleteProfessional}
                />
              ))}
            </div>
          )}
        </section>

        {showAddProfessional && (
          <AddProfessionalForm
            addProfessional={addProfessional}
            closeModal={() => setShowAddProfessional(false)}
          />
        )}

        {showEditProfessional && selectedProfessional && (
          <EditProfessionalForm
            professional={selectedProfessional}
            updateProfessional={updateProfessional}
            closeModal={() => {
              setShowEditProfessional(false);
              setSelectedProfessional(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AllProfessionals;