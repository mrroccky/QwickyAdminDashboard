import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import BookingCard from '../components/BookingCard';
import ServiceCard from '../components/ServiceCard';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingDetailsModal from '../components/BookingDetailsModal';
import AddServiceForm from '../components/AddServiceForm';
import AddProfessionalForm from '../components/AddProfessionalForm';
import EditProfessionalForm from '../components/EditProfessionalForm';
import EditServiceForm from '../components/EditServiceForm';
import ServiceDetailsModal from '../components/serviceDetailsModel';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Circular Progress Component (unchanged)
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
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [showEditProfessional, setShowEditProfessional] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showEditService, setShowEditService] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [error, setError] = useState('');
  const [bookingStats, setBookingStats] = useState({
    labels: ['Weekly', 'Monthly', 'Yearly'],
    datasets: [
      {
        label: 'Total Bookings',
        data: [0, 0, 0],
        backgroundColor: 'rgba(32, 117, 197, 0.7)',
        borderColor: '#2075C5',
        borderWidth: 2,
      },
    ],
  });
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Calculate date ranges for weekly, monthly, yearly stats
  const getDateRanges = () => {
    const today = new Date(); // Current date: June 2, 2025
    const formatDate = (date) => date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7); // May 26, 2025 to June 2, 2025
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30); // May 3, 2025 to June 2, 2025
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1); // June 2, 2024 to June 2, 2025

    return {
      weekly: { start: weekAgo, end: today },
      monthly: { start: monthAgo, end: today },
      yearly: { start: yearAgo, end: today },
    };
  };

  // Filter bookings by date range
  const filterBookingsByDate = (bookings, start, end) => {
    return bookings.filter((booking) => {
      const createdAt = new Date(booking.created_at);
      return createdAt >= start && createdAt <= end;
    }).length;
  };

  // Update booking stats
  const updateBookingStats = (bookings, customStart = null, customEnd = null) => {
    if (customStart && customEnd) {
      const formatDate = (date) => date.toISOString().split('T')[0];
      const customCount = filterBookingsByDate(bookings, customStart, customEnd);
      setBookingStats({
        labels: [`${formatDate(customStart)} to ${formatDate(customEnd)}`],
        datasets: [
          {
            label: 'Total Bookings',
            data: [customCount],
            backgroundColor: 'rgba(32, 117, 197, 0.7)',
            borderColor: '#2075C5',
            borderWidth: 2,
          },
        ],
      });
    } else {
      const ranges = getDateRanges();
      const weeklyCount = filterBookingsByDate(bookings, ranges.weekly.start, ranges.weekly.end);
      const monthlyCount = filterBookingsByDate(bookings, ranges.monthly.start, ranges.monthly.end);
      const yearlyCount = filterBookingsByDate(bookings, ranges.yearly.start, ranges.yearly.end);
      setBookingStats({
        labels: ['Weekly', 'Monthly', 'Yearly'],
        datasets: [
          {
            label: 'Total Bookings',
            data: [weeklyCount, monthlyCount, yearlyCount],
            backgroundColor: 'rgba(32, 117, 197, 0.7)',
            borderColor: '#2075C5',
            borderWidth: 2,
          },
        ],
      });
    }
  };

  // Fetch data
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/bookings`);
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const data = await response.json();
        setBookings(data);
        updateBookingStats(data); // Update stats after fetching bookings
      } catch (error) {
        setError(error.message);
      }
    };

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

  // Handle custom date range submission
  const handleCustomDateSubmit = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (startDate > endDate) {
      setError('Start date must be before end date');
      return;
    }
    updateBookingStats(bookings, startDate, endDate);
    setShowDatePickerModal(false);
    setError('');
  };

  // Other functions (unchanged)
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

  const addProfessional = (professional) => {
    setProfessionals([...professionals, professional]);
  };

  const updateProfessional = (updatedProfessional) => {
    setProfessionals(
      professionals.map((p) =>
        p.professional_id === updatedProfessional.professional_id ? updatedProfessional : p
      )
    );
  };

  const deleteProfessional = async (professionalId) => {
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/professionals/${professionalId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete professional');
      setProfessionals(professionals.filter((p) => p.professional_id !== professionalId));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate受験Booking = (updatedBooking) => {
    setBookings(
      bookings.map((booking) =>
        booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
      )
    );
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      setBookings(bookings.filter((booking) => booking.booking_id !== bookingId));
    } catch (error) {
      setError(error.message);
    }
  };

  const activeBookings = bookings.filter((booking) => booking.status === 'pending').slice(0, 3);
  const displayedServices = services.slice(0, 3);
  const displayedProfessionals = professionals.slice(0, 3);

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
            {bookings.filter((b) => b.status === 'pending').length > 3 && (
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
                <BookingCard
                  key={booking.booking_id}
                  booking={booking}
                  onClick={setSelectedBooking}
                  onDelete={handleDeleteBooking}
                />
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
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👥</span>
              </div>
              <p className="text-gray-500 text-lg">No professionals registered</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProfessionals.map((professional) => (
                <ProfessionalCard
                  key={professional.professional_id}
                  professional={professional}
                  onEdit={(p) => {
                    setSelectedProfessional(p);
                    setShowEditProfessional(true);
                  }}
                  onDelete={deleteProfessional}
                />
              ))}
            </div>
          )}
        </section>

        {/* Booking Statistics Section */}
        <section id="booking-stats" className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Booking Statistics</h3>
            <button
              onClick={() => setShowDatePickerModal(true)}
              className="text-[#2075C5] hover:text-[#1a5fa0] font-medium transition-colors duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Custom Date Range
            </button>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <Bar data={bookingStats} options={chartOptions} />
          </div>
        </section>

        {/* Date Picker Modal */}
        {showDatePickerModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Select Date Range</h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  onChange={setStartDate}
                  value={startDate}
                  maxDate={new Date()}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">End Date</label>
                <DatePicker
                  onChange={setEndDate}
                  value={endDate}
                  maxDate={new Date()}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDatePickerModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCustomDateSubmit}
                  className="px-4 py-2 bg-[#2075C5] text-white rounded-lg hover:bg-[#1a5fa0]"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals (unchanged) */}
        {selectedBooking && (
          <BookingDetailsModal
            booking={selectedBooking}
            closeModal={() => setSelectedBooking(null)}
            onUpdate={handleUpdateBooking}
            onDelete={handleDeleteBooking}
          />
        )}
        {showEditProfessional && selectedProfessional && (
          <EditProfessionalForm
            professional={selectedProfessional}
            updateProfessional={updateProfessional}
            closeModal={() => setShowEditProfessional(false)}
          />
        )}
        {showEditService && selectedService && (
          <EditServiceForm
            service={selectedService}
            updateService={updateService}
            closeModal={() => setShowEditService(false)}
          />
        )}
        {showDetailsModal && selectedService && (
          <ServiceDetailsModal
            service={selectedService}
            closeModal={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
