import React from 'react';

function ServiceCard({ service, onClick, onEdit, onDelete }) {
  const categoryMap = {
    1: 'Domestic',
    2: 'Commercial',
    3: 'Corporate',
    4: 'Extended',
    5: 'Quick'
  };

  const price = parseFloat(service.service_price) || 0;

  // Convert minutes to hours and minutes format
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

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${service.service_title}?`)) {
      onDelete(service.service_id);
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer"
      onClick={() => onClick(service)}
    >
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2 text-[#2075C5]">{service.service_title}</h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-gray-800">₹{price.toFixed(2)}</span>
          <span className="bg-blue-100 text-[#2075C5] px-3 py-1 rounded-full text-sm font-medium">
            {formatDuration(service.service_duration)}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
        <h3>Main Description</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{service.main_description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Type: <span className="font-medium text-gray-700">{service.service_type}</span>
          </span>
          <span className="text-gray-500">
            Category: <span className="font-medium text-gray-700">{categoryMap[service.category_id] || 'Unknown'}</span>
          </span>
        </div>
      </div>
      {service.service_image && (
        <img
          src={service.service_image}
          alt={service.service_title}
          className="mt-4 w-full h-32 object-cover rounded-xl"
        />
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from triggering
            onEdit(service);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            handleDelete();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;