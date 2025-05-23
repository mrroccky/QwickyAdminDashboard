import React from 'react';

function BookingDetailsModal({ booking, closeModal }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#2075C5] bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[#2075C5] text-2xl">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
          <p className="text-[#2075C5] font-medium">#{booking.id}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">User:</span>
            <span className="font-medium text-gray-800">{booking.user}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-800">{booking.userEmail}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Phone:</span>
            <span className="font-medium text-gray-800">{booking.userPhone}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium text-gray-800">{booking.service}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium text-gray-800">{booking.date} at {booking.time}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-yellow-600">{booking.status}</span>
          </div>
        </div>
        
        <button
          onClick={closeModal}
          className="w-full bg-[#2075C5] text-white p-4 rounded-xl hover:bg-[#1a5fa0] transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
        >
          Close Details
        </button>
      </div>
    </div>
  );
}

export default BookingDetailsModal;