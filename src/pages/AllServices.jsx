import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import AddServiceForm from '../components/AddServiceForm.jsx';

function AllServices() {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
         const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchServices();
  }, []);

  const addService = (service) => {
    setServices([...services, service]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">All Services</h2>
          <Link to="/" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Back to Dashboard
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <section id="services" className="mb-8">
          {services.length === 0 ? (
            <p className="text-gray-500">No active services</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.service_id} service={service} />
              ))}
            </div>
          )}
        </section>

        {showAddService && (
          <AddServiceForm addService={addService} closeModal={() => setShowAddService(false)} />
        )}
      </div>
    </div>
  );
}

export default AllServices;