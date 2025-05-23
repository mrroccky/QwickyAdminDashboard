import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BookingCard from '../components/BookingCard.jsx';
import BookingDetailsModal from '../components/BookingDetailsModal.jsx';

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
         const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchBookings();
  }, []);

  const activeBookings = bookings.filter((booking) => booking.status === 'Pending');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 animate-fade-in">All Active Bookings</h2>
          <Link to="/" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200">
            Back to Dashboard
          </Link>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <section id="active-bookings" className="mb-8">
          {activeBookings.length === 0 ? (
            <p className="text-gray-500">No active bookings</p>
          ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-200">
              {activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onClick={setSelectedBooking} />
              ))}
            </div>
          )}
        </section>

        {selectedBooking && (
          <BookingDetailsModal booking={selectedBooking} closeModal={() => setSelectedBooking(null)} />
        )}
      </div>
    </div>
  );
}

export default AllBookings;