import { useNavigate } from 'react-router-dom';

function Navbar({ setShowAddService, setShowAddProfessional, timeLeft, handleLogout }) {
  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#2075C5' }}>
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#2075C5' }}>Qwicky</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/')}
              className={`font-medium transition-colors duration-200 ${
                window.location.pathname === '/' ? 'text-[#2075C5]' : 'text-gray-700 hover:text-[#2075C5]'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/bookings')}
              className={`font-medium transition-colors duration-200 ${
                window.location.pathname === '/bookings' ? 'text-[#2075C5]' : 'text-gray-700 hover:text-[#2075C5]'
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => navigate('/services')}
              className={`font-medium transition-colors duration-200 ${
                window.location.pathname === '/services' ? 'text-[#2075C5]' : 'text-gray-700 hover:text-[#2075C5]'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/professionals')}
              className={`font-medium transition-colors duration-200 ${
                window.location.pathname === '/professionals' ? 'text-[#2075C5]' : 'text-gray-700 hover:text-[#2075C5]'
              }`}
            >
              Professionals
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;