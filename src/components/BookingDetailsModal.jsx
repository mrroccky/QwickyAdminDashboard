import { useState, useEffect } from 'react';

function BookingDetailsModal({ booking, closeModal, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState('Loading...');
  const [serviceTitle, setServiceTitle] = useState('Loading...');
  const [professionalName, setProfessionalName] = useState('Loading...');
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    service_id: booking.service_id || '',
    scheduled_date: booking.scheduled_date ? new Date(booking.scheduled_date).toISOString().split('T')[0] : '',
    scheduled_time: booking.scheduled_time || '',
    payment_status: booking.payment_status || 'pending',
    total_amount: booking.total_amount || '',
    address_line: booking.address_line || '',
    city: booking.city || '',
    state: booking.state || '',
    country: booking.country || '',
    postal_code: booking.postal_code || '',
    latitude: booking.latitude || '',
    longitude: booking.longitude || '',
    user_id: booking.user_id || '',
    professional_id: booking.professional_id || '',
    status: booking.status || 'pending',
  });

  useEffect(() => {
    const apiurl = import.meta.env.VITE_API_URL;

    // Fetch user name for display
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

    // Fetch service title for display
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

    // Fetch professional name for display
    const fetchProfessionalName = async () => {
      try {
        const profResponse = await fetch(`${apiurl}/professionals`);
        if (!profResponse.ok) throw new Error('Failed to fetch professionals');
        const professionals = await profResponse.json();
        const professional = professionals.find(
          (prof) => prof.professional_id === booking.professional_id
        );
        if (!professional) throw new Error('Professional not found');

        const userResponse = await fetch(`${apiurl}/users/${professional.user_id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch professional user');
        const userData = await userResponse.json();
        setProfessionalName(`${userData.first_name} ${userData.last_name}`);
      } catch (err) {
        setError(err.message);
        setProfessionalName('Unknown Professional');
      }
    };

    // Fetch all users for dropdown
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiurl}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch all services for dropdown
    const fetchServices = async () => {
      try {
        const response = await fetch(`${apiurl}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch all professionals for dropdown
    const fetchProfessionals = async () => {
      try {
        const profResponse = await fetch(`${apiurl}/professionals`);
        if (!profResponse.ok) throw new Error('Failed to fetch professionals');
        const professionals = await profResponse.json();
        // Fetch user names for each professional
        const professionalsWithNames = await Promise.all(
          professionals.map(async (prof) => {
            try {
              const userResponse = await fetch(`${apiurl}/users/${prof.user_id}`);
              if (!userResponse.ok) throw new Error('Failed to fetch user for professional');
              const userData = await userResponse.json();
              return {
                ...prof,
                name: `${userData.first_name} ${userData.last_name}`,
              };
            } catch (err) {
              return { ...prof, name: 'Unknown Professional' };
            }
          })
        );
        setProfessionals(professionalsWithNames);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserName();
    fetchServiceTitle();
    fetchProfessionalName();
    fetchUsers();
    fetchServices();
    fetchProfessionals();
  }, [booking.user_id, booking.service_id, booking.professional_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/bookings/${booking.booking_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      const updatedBooking = { ...booking, ...formData };
      onUpdate(updatedBooking);
      setIsEditing(false);
      alert('Booking updated successfully!');
    } catch (error) {
      console.error('Update Error:', error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/bookings/${booking.booking_id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete booking');
        onDelete(booking.booking_id);
        closeModal();
      } catch (error) {
        console.error('Delete Error:', error);
        alert(error.message);
      }
    }
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2075C5] to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Booking Details</h2>
              <p className="text-blue-100">#{booking.booking_id}</p>
            </div>
            <button
              onClick={closeModal}
              className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                  <select
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.user_id} value={user.user_id}>
                        {user.first_name} {user.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <select
                    name="service_id"
                    value={formData.service_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service.service_id} value={service.service_id}>
                        {service.service_title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    name="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <select
                    name="payment_status"
                    value={formData.payment_status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="total_amount"
                    value={formData.total_amount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional</label>
                  <select
                    name="professional_id"
                    value={formData.professional_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  >
                    <option value="">Select Professional</option>
                    {professionals.map((prof) => (
                      <option key={prof.professional_id} value={prof.professional_id}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                <input
                  type="text"
                  name="address_line"
                  value={formData.address_line}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2075C5] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">User</div>
                  <div className="font-semibold text-gray-800">{userName}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Service</div>
                  <div className="font-semibold text-gray-800">{serviceTitle}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Scheduled Date</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(booking.scheduled_date).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Scheduled Time</div>
                  <div className="font-semibold text-gray-800">{booking.scheduled_time}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Payment Status</div>
                  <div
                    className={`font-semibold ${
                      booking.payment_status === 'completed'
                        ? 'text-green-600'
                        : booking.payment_status === 'failed'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {booking.payment_status}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div
                    className={`font-semibold ${
                      booking.status === 'completed'
                        ? 'text-green-600'
                        : booking.status === 'cancelled'
                        ? 'text-red-600'
                        : booking.status === 'confirmed'
                        ? 'text-blue-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {booking.status}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                  <div className="font-semibold text-gray-800">${booking.total_amount}</div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Professional</div>
                  <div className="font-semibold text-gray-800">{professionalName}</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 rounded-xl">
                <div className="text-sm text-gray-600 mb-1">Address</div>
                <div className="font-semibold text-gray-800">
                  {booking.address_line}
                  <br />
                  {booking.city}, {booking.state}, {booking.country} {booking.postal_code}
                </div>
              </div>

              {(booking.latitude || booking.longitude) && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Coordinates</div>
                  <div className="font-semibold text-gray-800">
                    Lat: {booking.latitude || 'N/A'}, Lng: {booking.longitude || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with buttons */}
        <div className="bg-gray-50 p-6 border-t">
          {isEditing ? (
            <div className="flex space-x-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition duration-200 font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl hover:bg-gray-700 transition duration-200 font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 bg-[#2075C5] text-white py-3 px-4 rounded-xl hover:bg-[#1a5fa0] transition duration-200 font-medium"
              >
                Edit Booking
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition duration-200 font-medium"
              >
                Delete Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsModal;
