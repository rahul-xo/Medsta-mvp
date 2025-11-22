import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaVideo, FaUserMd } from 'react-icons/fa';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { doctor, date, time } = location.state || {};

  // Redirect if no state (direct access)
  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">No booking details found</h2>
          <Link to="/book-appointment" className="text-blue-600 hover:underline mt-2 block">Go back to search</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Link to={`/doctor/${doctor.id}`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium text-sm">
          <FaArrowLeft /> Back to Doctor's Profile
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h1 className="text-2xl font-bold text-slate-900">Book Appointment</h1>
            
            {/* Stepper */}
            <div className="flex items-center mt-6 text-sm">
              <div className="flex items-center text-blue-600 font-semibold">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs mr-2">1</span>
                Review Details
              </div>
              <div className="h-px w-12 bg-slate-200 mx-4"></div>
              <div className="flex items-center text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mr-2">2</span>
                Payment
              </div>
              <div className="h-px w-12 bg-slate-200 mx-4"></div>
              <div className="flex items-center text-slate-400">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs mr-2">3</span>
                Confirmation
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Appointment Details */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-slate-400" /> Appointment Details
              </h2>
              <div className="bg-slate-50 rounded-xl p-6 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-900 text-right">{doctor.name} <span className="text-slate-500 font-normal">({doctor.specialty})</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-900">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-900">{time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-900">Online</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-500">Type</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" defaultChecked className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700 flex items-center gap-1"><FaVideo className="text-blue-500" /> Video</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" className="text-blue-600 focus:ring-blue-500" />
                      <span className="text-slate-700 flex items-center gap-1"><FaUserMd className="text-slate-400" /> In-Person</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Consultation Fee</span>
                  <span className="font-bold text-blue-600 text-lg">₹{doctor.fee}</span>
                </div>
              </div>
            </section>

            {/* User Information */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaUserMd className="text-slate-400" /> Your Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Alex Kumar"
                    className="w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue="9876543210"
                    className="w-full rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </section>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 mt-4">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
