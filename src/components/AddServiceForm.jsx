import { useState } from 'react';

function AddServiceForm({ addService, closeModal }) {
  const [serviceTitle, setServiceTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [serviceImage, setServiceImage] = useState('');
  const [location, setLocation] = useState(''); // New state for location
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!serviceTitle || !description || !serviceType || !servicePrice || 
        !serviceDuration || !categoryId || !serviceImage) {
      setError('All fields are required');
      return;
    }

    // Split description by newlines and filter out empty strings
    const descriptionArray = description.split('\n').filter(item => item.trim() !== '');
    if (descriptionArray.length === 0) {
      setError('Description cannot be empty');
      return;
    }

    // Validate duration (e.g., "60" → 60 minutes)
    const totalMinutes = parseInt(serviceDuration, 10);
    if (isNaN(totalMinutes) || totalMinutes <= 0) {
      setError('Duration must be a positive number of minutes (e.g., 60)');
      return;
    }

    const formData = new FormData();
    formData.append('service_title', serviceTitle);
    formData.append('description', JSON.stringify(descriptionArray));
    formData.append('service_type', serviceType);
    formData.append('service_price', servicePrice);
    formData.append('service_duration', totalMinutes.toString());
    formData.append('category_id', categoryId);
    formData.append('service_image', serviceImage);
    formData.append('location', location.toLowerCase());

    console.log('Sending FormData:');
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const apiurl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiurl}/services`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const { service_id } = await response.json();
      addService({
        service_id,
        service_title: serviceTitle,
        description: descriptionArray,
        service_type: serviceType,
        service_price: parseFloat(servicePrice),
        service_duration: totalMinutes,
        category_id: parseInt(categoryId),
        service_image: serviceImage,
        is_active: true,
      });

      setMessage('Service added successfully');
      setIsSubmitted(true); // Mark as submitted

      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
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
        ) : (
          <>
            <h2 className="text-xl font-bold mb-3 text-gray-800">Add Service</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="serviceTitle">Title</label>
                  <input
                    type="text"
                    id="serviceTitle"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={serviceTitle}
                    onChange={(e) => setServiceTitle(e.target.value)}
                    placeholder="Title"
                    disabled={isSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="serviceType">Type</label>
                  <input
                    type="text"
                    id="serviceType"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    placeholder="Type"
                    disabled={isSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="servicePrice">Price (₹)</label>
                  <input
                    type="number"
                    id="servicePrice"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    placeholder="Price"
                    step="0.01"
                    disabled={isSubmitted}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="serviceDuration">Duration (In Minutes)</label>
                  <input
                    type="text"
                    id="serviceDuration"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(e.target.value)}
                    placeholder="e.g., 60"
                    disabled={isSubmitted}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm mb-1" htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={isSubmitted}
                  >
                    <option value="" disabled>Select</option>
                    <option value="1">Domestic</option>
                    <option value="2">Commercial</option>
                    <option value="3">Corporate</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="description">Description (separate with \n)</label>
                <textarea
                  id="description"
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., cleaning\nmop"
                  rows="4"
                  disabled={isSubmitted}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="serviceImage">Image URL</label>
                <input
                  type="text"
                  id="serviceImage"
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={serviceImage}
                  onChange={(e) => setServiceImage(e.target.value)}
                  placeholder="Image URL"
                  required
                  disabled={isSubmitted}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 text-sm mb-1" htmlFor="location">Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Nagpur"
                  disabled={isSubmitted}
                />
              </div>
              {message && <p className="text-green-500 text-sm mb-2">{message}</p>}
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200 text-sm"
                  disabled={isSubmitted}
                >
                  Add Service
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

export default AddServiceForm;