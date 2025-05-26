import { useState, useEffect, useRef } from 'react';

function AddProfessionalForm({ addProfessional, closeModal }) {
  const [serviceId, setServiceId] = useState('');
  const [userId, setUserId] = useState('');
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State for nested user form
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: ''
  }); // State for new user form fields
  const [userFormError, setUserFormError] = useState('');

  const serviceDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Fetch services and users
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        const data = await response.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchUsers = async () => {
      try {
        const apiurl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiurl}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchServices();
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter services and users based on search
  const filteredServices = services.filter((service) =>
    (service?.service_title || '').toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    (`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    if (serviceId) formData.append('service_id', serviceId);
    if (userId) formData.append('user_id', userId);

    console.log('Sending FormData:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/professionals`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create professional');
      }

      const { professional_id } = await response.json();
      addProfessional({
        professional_id,
        service_id: serviceId ? parseInt(serviceId) : null,
        user_id: userId ? parseInt(userId) : null,
        created_at: new Date().toISOString(),
      });

      setMessage('Professional added successfully');
      setServiceId('');
      setUserId('');
      setServiceSearch('');
      setUserSearch('');
      setIsSubmitted(true);

      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle selecting a service
  const handleServiceSelect = (service) => {
    setServiceId(service.service_id);
    setServiceSearch(service.service_title || 'Unnamed Service');
    setShowServiceDropdown(false);
  };

  // Handle selecting a user
  const handleUserSelect = (user) => {
    setUserId(user.user_id);
    setUserSearch(`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User');
    setShowUserDropdown(false);
  };

  // Handle new user form submission
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    setUserFormError('');

    const { first_name, last_name, email, phone_number, password } = newUser;
    if (!first_name || !last_name || !email || !phone_number || !password) {
      setUserFormError('All fields are required');
      return;
    }

    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const { user_id } = await response.json();
      const newUserData = {
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        account_status: 'active'
      };

      setUsers([...users, newUserData]);
      setUserId(user_id);
      setUserSearch(`${first_name} ${last_name}`.trim());
      setShowAddUserForm(false);
      setShowUserDropdown(false);
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        password: ''
      });
    } catch (err) {
      setUserFormError(err.message);
    }
  };

  // Handle new user form input changes
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle add user form
  const handleAddNewUserClick = () => {
    setShowAddUserForm(true);
    setShowUserDropdown(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center p-6">
            <svg
              className="w-12 h-12 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-green-500 text-lg font-semibold">{message}</p>
          </div>
        ) : showAddUserForm ? (
          <div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Add New User</h2>
            <form onSubmit={handleAddUserSubmit}>
              <div className="grid grid-cols-1 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={newUser.first_name}
                    onChange={handleNewUserChange}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={newUser.last_name}
                    onChange={handleNewUserChange}
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="phone_number">Phone Number</label>
                  <input
                    type="text"
                    id="phone_number"
                    name="phone_number"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={newUser.phone_number}
                    onChange={handleNewUserChange}
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    placeholder="Password"
                  />
                </div>
              </div>
              {userFormError && <p className="text-red-500 text-sm mb-2">{userFormError}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Add Professional</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="relative" ref={serviceDropdownRef}>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="serviceSelect">Service</label>
                  <input
                    type="text"
                    id="serviceSelect"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={serviceSearch}
                    onChange={(e) => {
                      setServiceSearch(e.target.value);
                      setShowServiceDropdown(true);
                      setServiceId('');
                    }}
                    onClick={() => setShowServiceDropdown(true)}
                    placeholder="Search or select service (Optional)"
                    disabled={isSubmitted}
                  />
                  {showServiceDropdown && !isSubmitted && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          value={serviceSearch}
                          onChange={(e) => {
                            setServiceSearch(e.target.value);
                            setServiceId('');
                          }}
                          placeholder="Search services"
                        />
                      </div>
                      {filteredServices.length > 0 ? (
                        filteredServices.map((service) => (
                          <div
                            key={service.service_id}
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleServiceSelect(service)}
                          >
                            {service.service_title || 'Unnamed Service'}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No services found</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative" ref={userDropdownRef}>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="userSelect">User</label>
                  <input
                    type="text"
                    id="userSelect"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                      setUserId('');
                    }}
                    onClick={() => setShowUserDropdown(true)}
                    placeholder="Search or select user (Optional)"
                    disabled={isSubmitted}
                  />
                  {showUserDropdown && !isSubmitted && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2">
                        <input
                          type="text"
                          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                          value={userSearch}
                          onChange={(e) => {
                            setUserSearch(e.target.value);
                            setUserId('');
                          }}
                          placeholder="Search users"
                        />
                      </div>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <div
                            key={user.user_id}
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleUserSelect(user)}
                          >
                            {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User'}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                      )}
                      <div
                        className="px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 cursor-pointer font-semibold"
                        onClick={handleAddNewUserClick}
                      >
                        + Add new user
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                  disabled={isSubmitted}
                >
                  Add Professional
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition duration-200 text-sm"
                  disabled={isSubmitted}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default AddProfessionalForm;