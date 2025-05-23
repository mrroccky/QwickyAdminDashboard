import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Add Link import
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import BookingCard from '../components/BookingCard';
import ServiceCard from '../components/ServiceCard';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AddServiceForm from '../components/AddServiceForm';
import AddProfessionalForm from '../components/AddProfessionalForm';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Circular Progress Component
function CircularProgress({ percentage, size = 120, strokeWidth = 8, label, value, color = "#2075C5" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{value}</span>
          <span className="text-xs text-gray-500 text-center">{label}</span>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [error, setError] = useState('');

  // Fetch data
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

    const fetchServices = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        console.log(apiurl);
        const response = await fetch(`${apiurl}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchProfessionals = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/professionals`);
        if (!response.ok) throw new Error('Failed to fetch professionals');
        const data = await response.json();
        setProfessionals(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchBookings();
    fetchServices();
    fetchProfessionals();
  }, []);

  const addService = (service) => {
    setServices([...services, service]);
  };

  const addProfessional = (professional) => {
    setProfessionals([...professionals, professional]);
  };

  const activeBookings = bookings.filter((booking) => booking.status === 'Pending').slice(0, 3);
  const displayedServices = services.slice(0, 3);
  const displayedProfessionals = professionals.slice(0, 3);

  // Enhanced booking stats with primary color
  const bookingStats = {
    labels: ['Weekly', 'Monthly', 'Yearly'],
    datasets: [
      {
        label: 'Total Bookings',
        data: [12, 45, 320],
        backgroundColor: 'rgba(32, 117, 197, 0.7)',
        borderColor: '#2075C5',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Booking Statistics', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Bookings' } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h2>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Active Bookings Section */}
        <section id="active-bookings" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Active Bookings</h3>
            {bookings.filter((b) => b.status === 'Pending').length > 3 && (
              <Link
                to="/bookings"
                className="text-[#2075C5] hover:text-[#1a5fa0] font-medium transition-colors duration-200"
              >
                View All →
              </Link>
            )}
          </div>
          {activeBookings.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📋</span>
              </div>
              <p className="text-gray-500 text-lg">No active bookings at the moment</p>
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-4">
              {activeBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onClick={setSelectedBooking} />
              ))}
            </div>
          )}
        </section>

        {/* Services Section */}
        <section id="services" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Active Services</h3>
            {services.length > 3 && (
              <Link
                to="/services"
                className="text-[#2075C5] hover:text-[#1a5fa0] font-medium transition-colors duration-200"
              >
                View All →
              </Link>
            )}
          </div>
          {displayedServices.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">🛠️</span>
              </div>
              <p className="text-gray-500 text-lg">No active services available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedServices.map((service) => (
                <ServiceCard key={service.service_id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* Professionals Section */}
        <section id="professionals" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Professionals</h3>
            {professionals.length > 3 && (
              <Link
                to="/professionals"
                className="text-[#2075C5] hover:text-[#1a5fa0] font-medium transition-colors duration-200"
              >
                View All →
              </Link>
            )}
          </div>
          {displayedProfessionals.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100 desktop">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👥</span>
              </div>
              <p className="text-gray-500 text-lg">No professionals registered</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProfessionals.map((professional) => (
                <ProfessionalCard key={professional.professional_id} professional={professional} />
              ))}
            </div>
          )}
        </section>

        {/* Booking Statistics Section */}
        <section id="booking-stats" className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Booking Statistics</h3>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <Bar data={bookingStats} options={chartOptions} />
          </div>
        </section>

        {/* Modals */}
        {selectedBooking && (
          <BookingDetailsModal booking={selectedBooking} closeModal={() => setSelectedBooking(null)} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;