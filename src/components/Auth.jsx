import { useState } from "react";
function Auth({ setIsAuthenticated, setLastActivity }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const storedPassword = import.meta.env.VITE_MAIN_PASS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === storedPassword) {
      const now = Date.now();
      setIsAuthenticated(true);
      setLastActivity(now);
      setError('');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
export default Auth;