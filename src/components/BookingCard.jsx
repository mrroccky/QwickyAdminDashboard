import { useState, useEffect } from 'react';

function BookingCard({ booking, onClick, onDelete }) {
  const [userName, setUserName] = useState('Loading...');
  const [serviceTitle, setServiceTitle] = useState('Loading...');
  const [professionalName, setProfessionalName] = useState('Loading...');
  const [error, setError] = useState('');

  useEffect(() => {
    const apiurl = import.meta.env.VITE_API_URL;

    // Fetch user name
    const fetchUserName = async () => {
      try {
        const response = await fetch(`${apiurl}/users/${booking.user_id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const data = await response.json();
        setUserName(`${data.first_name} ${data.last_name}`);
      } catch (err) {
        setError(err.message);
        setUserName('Unknown User');
      }
    };

    // Fetch service title
    const fetchServiceTitle = async () => {
      try {
        const response = await fetch(`${apiurl}/services/${booking.service_id}`);
        if (!response.ok) throw new Error('Failed to fetch service');
        const data = await response.json();
        setServiceTitle(data.service_title);
      } catch (err) {
        setError(err.message);
        setServiceTitle('Unknown Service');
      }
    };

    // Fetch professional name
    const fetchProfessionalName = async () => {
      try {
        // Fetch all professionals
        const profResponse = await fetch(`${apiurl}/professionals`);
        if (!profResponse.ok) throw new Error('Failed to fetch professionals');
        const professionals = await profResponse.json();
        
        // Find the professional with matching professional_id
        const professional = professionals.find(
          (prof) => prof.professional_id === booking.professional_id
        );
        if (!professional) throw new Error('Professional not found');

        // Fetch user data for the professional's user_id
        const userResponse = await fetch(`${apiurl}/users/${professional.user_id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch professional user');
        const userData = await userResponse.json();
        setProfessionalName(`${userData.first_name} ${userData.last_name}`);
      } catch (err) {
        setError(err.message);
        setProfessionalName('Unknown Professional');
      }
    };

    fetchUserName();
    fetchServiceTitle();
    fetchProfessionalName();
  }, [booking.user_id, booking.service_id, booking.professional_id]);

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (window.confirm('Are you sure you want to delete this booking?')) {
      onDelete(booking.booking_id);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[300px] flex-shrink-0 transform hover:-translate-y-1 border border-gray-100"
      onClick={() => onClick(booking)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-[#2075C5]">Booking #{booking.booking_id}</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
            {booking.status}
          </span>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2075C5] bg-opacity-10 rounded-lg flex items-center justify-center">
            <span className="text-[#2075C5] text-sm">👤</span>
          </div>
          <span className="font-medium text-gray-800">{userName}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2075C5] bg-opacity-10 rounded-lg flex items-center justify-center">
            <span className="text-[#2075C5] text-sm">🛠️</span>
          </div>
          <span className="font-medium text-gray-800">{serviceTitle}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2075C5] bg-opacity-10 rounded-lg flex items-center justify-center">
            <span className="text-[#2075C5] text-sm">💼</span>
          </div>
          <span className="font-medium text-gray-800">{professionalName}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>📅 {new Date(booking.scheduled_date).toLocaleDateString()}</span>
          <span>🕐 {booking.scheduled_time}</span>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

export default BookingCard;