import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard.jsx';
import AddServiceForm from '../components/AddServiceForm.jsx';
import EditServiceForm from '../components/EditServiceForm.jsx';
import ServiceDetailsModal from '../components/serviceDetailsModel.jsx';

function AllServices() {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
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

  const updateService = (updatedService) => {
    setServices(
      services.map((s) => (s.service_id === updatedService.service_id ? updatedService : s))
    );
  };

  const deleteService = async (serviceId) => {
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/services/${serviceId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      setServices(services.filter((s) => s.service_id !== serviceId));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">All Services</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddService(true)}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add Service
            </button>
            <Link to="/" className="bg-gray-300 text-gray-800 p-3 rounded-lg hover:bg-gray-400 transition duration-200">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <section id="services" className="mb-8">
          {services.length === 0 ? (
            <p className="text-gray-500">No active services</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <ServiceCard
                  key={service.service_id}
                  service={service}
                  onClick={(s) => {
                    setSelectedService(s);
                    setShowDetailsModal(true);
                  }}
                  onEdit={(s) => {
                    setSelectedService(s);
                    setShowEditService(true);
                  }}
                  onDelete={deleteService}
                />
              ))}
            </div>
          )}
        </section>

        {showAddService && (
          <AddServiceForm addService={addService} closeModal={() => setShowAddService(false)} />
        )}
        {showEditService && selectedService && (
          <EditServiceForm
            service={selectedService}
            updateService={updateService}
            closeModal={() => setShowEditService(false)}
          />
        )}
        {showDetailsModal && selectedService && (
          <ServiceDetailsModal service={selectedService} closeModal={() => setShowDetailsModal(false)} />
        )}
      </div>
    </div>
  );
}

export default AllServices;