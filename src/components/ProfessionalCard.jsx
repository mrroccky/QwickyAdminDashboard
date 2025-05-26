import { useState, useEffect } from 'react';

function ProfessionalCard({ professional, onEdit, onDelete }) {
  const [serviceName, setServiceName] = useState('Loading...');
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        if (professional.service_id) {
          const serviceResponse = await fetch(`${apiurl}/services/${professional.service_id}`);
          if (serviceResponse.ok) {
            const service = await serviceResponse.json();
            setServiceName(service.service_title || 'Unnamed Service');
          }
        }
        if (professional.user_id) {
          const userResponse = await fetch(`${apiurl}/users`);
          if (userResponse.ok) {
            const users = await userResponse.json();
            const user = users.find((u) => u.user_id === professional.user_id);
            if (user) {
              setUserName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User');
            }
          }
        }
      } catch (error) {
        console.error('Error fetching names:', error);
        setServiceName('Error loading');
        setUserName('Error loading');
      }
    };
    fetchNames();
  }, [professional.service_id, professional.user_id]);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Professional #${professional.professional_id}?`)) {
      onDelete(professional.professional_id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-[#2075C5] bg-opacity-10 rounded-xl flex items-center justify-center">
          <span className="text-[#2075C5] text-xl">👨‍💼</span>
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#2075C5]">Professional #{professional.professional_id}</h3>
          <p className="text-gray-500 text-sm">ID: {professional.professional_id}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Service:</span>
          <span className="font-medium text-gray-800">{serviceName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">User:</span>
          <span className="font-medium text-gray-800">{userName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Created:</span>
          <span className="font-medium text-gray-800 text-sm">{new Date(professional.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(professional)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ProfessionalCard;