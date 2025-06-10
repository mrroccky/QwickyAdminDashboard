import { useState, useEffect } from 'react';

function EditProfessionalForm({ professional, updateProfessional, closeModal }) {
  const [formData, setFormData] = useState({
    service_id: professional.service_id || '',
    user_id: professional.user_id || '',
    status: professional.status || 'pending',
    uploaded_file: null,
    document_type: 'PAN Card',
    bio: professional.bio || '',
    experience_years: professional.experience_years || '',
  });
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(professional.uploaded_file || null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, or JPG images are allowed');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, uploaded_file: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const formDataToSend = new FormData();
      formDataToSend.append('service_id', formData.service_id);
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('document_type', formData.document_type);
      formDataToSend.append('bio', formData.bio || '');
      formDataToSend.append('experience_years', formData.experience_years || '');
      if (formData.uploaded_file) {
        const base64String = formData.uploaded_file.split(',')[1];
        formDataToSend.append('uploaded_file', base64String);
      }

      const response = await fetch(`${apiurl}/professionals/${professional.professional_id}`, {
        method: 'PUT',
        body: formDataToSend,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
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
          <div>
            <label className="block text-gray-600 mb-1">Document Type</label>
            <select
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="PAN Card">PAN Card</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              rows={4}
              placeholder="Enter professional bio"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Experience Years</label>
            <input
              type="text"
              name="experience_years"
              value={formData.experience_years}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Enter years of experience"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Upload Image (JPEG, JPG, PNG)</label>
            <input
              type="file"
              name="uploaded_file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-lg"
            />
            {preview && (
              <img
                src={preview}
                alt="Image preview"
                className="mt-2 max-w-full h-auto rounded-lg"
                style={{ maxHeight: '200px' }}
              />
            )}
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
