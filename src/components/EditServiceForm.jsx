import { useState } from 'react';

function EditServiceForm({ service, updateService, closeModal }) {
  const [formData, setFormData] = useState({
    service_title: service.service_title || '',
    description: service.description || '',
    service_type: service.service_type || '',
    service_price: service.service_price || '',
    service_duration: service.service_duration || '',
    category_id: service.category_id || '',
    service_image: service.service_image || '',
  });
  const [error, setError] = useState('');

  const categoryMap = {
    1: 'Domestic',
    2: 'Commercial',
    3: 'Corporate',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/services/${service.service_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update service');
      const updatedService = await response.json();
      updateService({ ...service, ...formData }); // Update local state with form data
      closeModal();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Service</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Service Title</label>
            <input
              type="text"
              name="service_title"
              value={formData.service_title}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Service Type</label>
            <input
              type="text"
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Price (₹)</label>
            <input
              type="number"
              name="service_price"
              value={formData.service_price}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="service_duration"
              value={formData.service_duration}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="">Select a category</option>
              {Object.entries(categoryMap).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Image URL</label>
            <input
              type="text"
              name="service_image"
              value={formData.service_image}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
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

export default EditServiceForm;