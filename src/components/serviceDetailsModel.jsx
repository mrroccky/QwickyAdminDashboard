import React from 'react';

function ServiceDetailsModal({ service, closeModal }) {
  const categoryMap = {
    1: 'Domestic',
    2: 'Commercial',
    3: 'Corporate',
    4:'Extended',
    5:'Quick'
  };

  const price = parseFloat(service.service_price) || 0;

  const formatDuration = (minutes) => {
    if (!minutes || minutes === 0) return '0 min';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${remainingMinutes} min`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{service.service_title}</h2>
        <div className="space-y-4">
          <div>
            <span className="text-gray-600">Price:</span>
            <span className="font-medium text-gray-800 ml-2">₹{price.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium text-gray-800 ml-2">{formatDuration(service.service_duration)}</span>
          </div>
          <div>
            <span className="text-gray-600">Type:</span>
            <span className="font-medium text-gray-800 ml-2">{service.service_type}</span>
          </div>
          <div>
            <span className="text-gray-600">Category:</span>
            <span className="font-medium text-gray-800 ml-2">{categoryMap[service.category_id] || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-600">Description:</span>
            <p className="text-gray-800 mt-1">{service.description}</p>
            <p className="text-gray-800 mt-1">{service.main_description}</p>
          </div>
          {service.service_image && (
            <img
              src={service.service_image}
              alt={service.service_title}
              className="w-full h-48 object-cover rounded-xl"
            />
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetailsModal;