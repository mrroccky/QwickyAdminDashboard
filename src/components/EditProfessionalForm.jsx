import { useState, useEffect } from 'react';

function EditProfessionalForm({ professional, updateProfessional, closeModal }) {
  const [formData, setFormData] = useState({
    service_id: professional.service_id || '',
    user_id: professional.user_id || '',
  });
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServicesAndUsers = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const serviceResponse = await fetch(`${apiurl}/services`);
        if (serviceResponse.ok) {
          const serviceData = await serviceResponse.json();
          setServices(serviceData);
        }
        const userResponse = await fetch(`${apiurl}/users`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUsers(userData);
        }
      } catch (error) {
        setError('Failed to fetch services or users');
      }
    };
    fetchServicesAndUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/professionals/${professional.professional_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update professional');
      const updatedProfessional = await response.json();
      updateProfessional(updatedProfessional);
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Professional</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Service</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.service_title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">User</label>
            <select
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfessionalForm;