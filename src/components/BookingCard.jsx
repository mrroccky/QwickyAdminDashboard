import React from 'react';

function BookingCard({ booking, onClick }) {
  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer min-w-[300px] flex-shrink-0 transform hover:-translate-y-1 border border-gray-100"
      onClick={() => onClick(booking)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-[#2075C5]">Booking #{booking.id}</h3>
        <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-medium">
          {booking.status}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2075C5] bg-opacity-10 rounded-lg flex items-center justify-center">
            <span className="text-[#2075C5] text-sm">👤</span>
          </div>
          <span className="font-medium text-gray-800">{booking.user}</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#2075C5] bg-opacity-10 rounded-lg flex items-center justify-center">
            <span className="text-[#2075C5] text-sm">🛠️</span>
          </div>
          <span className="font-medium text-gray-800">{booking.service}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>📅 {booking.date}</span>
          <span>🕐 {booking.time}</span>
        </div>
      </div>
    </div>
  );
}

export default BookingCard;