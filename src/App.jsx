import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard.jsx';
import AllBookings from './pages/AllBookings.jsx';
import AllServices from './pages/AllServices.jsx';
import AllProfessionals from './pages/AllProfessionals.jsx';
import Auth from './components/Auth.jsx';
import Navbar from './components/Navbar.jsx';
import AddServiceForm from './components/AddServiceForm.jsx';
import AddProfessionalForm from './components/AddProfessionalForm.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [showAddService, setShowAddService] = useState(false);
  const [showAddProfessional, setShowAddProfessional] = useState(false);

  // Session timeout - 10 minutes (600 seconds)
  const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

  // Check session validity and update timer
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const remainingTime = SESSION_TIMEOUT - timeSinceLastActivity;

      if (remainingTime <= 0) {
        // Session expired
        setIsAuthenticated(false);
        alert('Session expired. Please login again.');
      } else {
        // Update countdown timer
        setTimeLeft(Math.floor(remainingTime / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastActivity]);

  // Update activity on any interaction
  const updateActivity = () => {
    if (isAuthenticated) {
      setLastActivity(Date.now());
    }
  };

  // Add event listeners for user activity
  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      const handleActivity = () => updateActivity();
      events.forEach((event) => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, handleActivity, true);
        });
      };
    }
  }, [isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setTimeLeft(600);
  };

  // Handle adding a service
  const addService = (service) => {
    console.log('Service added:', service);
    setShowAddService(false);
  };

  // Handle adding a professional
  const addProfessional = (professional) => {
    console.log('Professional added:', professional);
    setShowAddProfessional(false);
  };

  // Close modals
  const closeServiceModal = () => setShowAddService(false);
  const closeProfessionalModal = () => setShowAddProfessional(false);

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Auth setIsAuthenticated={setIsAuthenticated} setLastActivity={setLastActivity} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          setShowAddService={setShowAddService}
          setShowAddProfessional={setShowAddProfessional}
          handleLogout={handleLogout}
          timeLeft={timeLeft}
        />
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<AllBookings />} />
            <Route path="/services" element={<AllServices />} />
            <Route path="/professionals" element={<AllProfessionals />} />
          </Routes>
        </div>
        {showAddService && (
          <AddServiceForm addService={addService} closeModal={closeServiceModal} />
        )}
        {showAddProfessional && (
          <AddProfessionalForm addProfessional={addProfessional} closeModal={closeProfessionalModal} />
        )}
      </div>
    </Router>
  );
}

export default App;