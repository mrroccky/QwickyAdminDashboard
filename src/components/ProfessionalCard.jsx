import { useState, useEffect } from 'react';

function ProfessionalCard({ professional, onEdit, onDelete }) {
  const [serviceName, setServiceName] = useState('Loading...');
  const [userName, setUserName] = useState('Loading...');
  const [userDetails, setUserDetails] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;

        if (professional.service_id) {
          const serviceResponse = await fetch(`${apiurl}/services/${professional.service_id}`);
          if (serviceResponse.ok) {
            const service = await serviceResponse.json();
            console.log('Service response:', service);
            setServiceName(service.service_title || 'Unnamed Service');
          } else {
            setServiceName('Service not found');
          }
        } else {
          setServiceName('No service assigned');
        }

        if (professional.user_id) {
          const userResponse = await fetch(`${apiurl}/users/${professional.user_id}`);
          if (userResponse.ok) {
            const user = await userResponse.json();
            console.log('User response:', user);
            setUserName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User');
          } else {
            setUserName('User not found');
          }
        } else {
          setUserName('No user assigned');
        }
      } catch (error) {
        console.error('Error fetching names:', error);
        setServiceName('Error loading service');
        setUserName('Error loading user');
      }
    };
    fetchNames();
  }, [professional.service_id, professional.user_id]);

  const handleCardClick = async () => {
    if (!isExpanded && professional.user_id) {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/users/${professional.user_id}`);
        if (!response.ok) throw new Error('Failed to fetch user details');
        const user = await response.json();
        console.log('User details response:', user);
        setUserDetails(user);
      } catch (error) {
        setError(error.message);
      }
    }
    setIsExpanded(!isExpanded);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Professional #${professional.professional_id}?`)) {
      onDelete(professional.professional_id);
    }
  };

  const uploadedFile = professional.uploaded_file;
  const isImage = uploadedFile && uploadedFile.startsWith('data:image/');

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
    >
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
          <span className="text-gray-600">Status:</span>
          <span className="font-medium text-gray-800">{professional.status}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Created:</span>
          <span className="font-medium text-gray-800 text-sm">{new Date(professional.created_at).toLocaleDateString()}</span>
        </div>
        {professional.status === 'pending' && uploadedFile && isImage && (
          <div className="mt-3">
            <span className="text-gray-600">Uploaded File:</span>
            <img
              src={uploadedFile}
              alt="Uploaded document"
              className="mt-2 max-w-full h-auto rounded-lg shadow-md"
              style={{ maxHeight: '200px' }}
              onError={(e) => {
                console.error('Image load error:', uploadedFile);
                e.target.alt = 'Error loading image';
              }}
            />
          </div>
        )}
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-bold text-gray-800">Professional Details</h4>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bio:</span>
                <span className="font-medium text-gray-800">{professional.bio || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Experience Years:</span>
                <span className="font-medium text-gray-800">{professional.experience_years || 'N/A'}</span>
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mt-4">User Details</h4>
            {userDetails ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">User ID:</span>
                  <span className="font-medium text-gray-800">{userDetails.user_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">First Name:</span>
                  <span className="font-medium text-gray-800">{userDetails.first_name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Name:</span>
                  <span className="font-medium text-gray-800">{userDetails.last_name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">{userDetails.email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium text-gray-800">{userDetails.phone || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Loading user details...</p>
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(professional);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfessionalCard;