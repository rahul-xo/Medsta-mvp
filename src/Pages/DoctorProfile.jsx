import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaStethoscope, FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaVideo, FaCheckCircle } from 'react-icons/fa';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);

  // Mock doctor data
  const doctor = {
    id: id,
    name: "Dr. Aman",
    specialty: "Physiotherapist",
    experience: "10 years",
    clinic: "Sunrise Health Clinic",
    location: "Bakshi Ka Talab, Lucknow, Uttar Pradesh, India",
    fee: 1600,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600",
    isVerified: true,
    isOnline: true
  };

  // Mock slots generation
  const generateSlots = () => {
    const slots = [
      "09:00 AM", "09:30 AM", "10:00 AM",
      "02:00 PM", "02:30 PM", "04:00 PM"
    ];
    return slots;
  };

  const handleDateClick = (offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedTime) return;
    navigate('/booking/confirm', {
      state: {
        doctor: doctor,
        date: selectedDate.toISOString(),
        time: selectedTime
      }
    });
  };

  // Generate next 7 days for calendar
  const calendarDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date,
      offset: i
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <Link to={`/clinic/1`} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium">
          <FaArrowLeft /> Back to Doctor Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Doctor Image Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm p-4 border border-slate-100 sticky top-24">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-b from-slate-800 to-slate-900">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <h1 className="text-3xl font-bold">{doctor.name}</h1>
                  <p className="text-white/80 font-medium">{doctor.specialty}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Online
                    </div>
                    {doctor.isVerified && (
                      <div className="flex items-center gap-1 text-xs bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                        <FaCheckCircle className="text-blue-400" /> Verified Partner
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 px-2">
                <h3 className="text-xl font-bold text-slate-900">About Dr. {doctor.name}</h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                  Dr. {doctor.name} is a highly skilled {doctor.specialty} with over {doctor.experience} of experience in treating patients with various musculoskeletal conditions. Dedicated to providing personalized care and effective treatment plans.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Booking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Professional Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Professional Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mt-1">
                    <FaStethoscope />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Specialization</p>
                    <p className="text-slate-900 font-semibold">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mt-1">
                    <FaBriefcase />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Experience</p>
                    <p className="text-slate-900 font-semibold">{doctor.experience}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mt-1">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Clinic</p>
                    <p className="text-slate-900 font-semibold">{doctor.clinic}, {doctor.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mt-1">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Consultation Fee</p>
                    <p className="text-slate-900 font-semibold">₹{doctor.fee}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2 text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <FaVideo className="text-slate-400" />
                  <span className="text-sm font-medium">Video Consultation Available</span>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Book an Appointment</h2>
              <p className="text-slate-500 text-sm mb-6">Select a date to see available time slots.</p>

              <div className="flex flex-col md:flex-row gap-8">
                {/* Calendar Strip */}
                <div className="md:w-1/2">
                  <div className="flex items-center justify-between mb-4">
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FaArrowLeft size={12} /></button>
                    <span className="font-semibold text-slate-900">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 rotate-180"><FaArrowLeft size={12} /></button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, index) => {
                      const isSelected = selectedDate.getDate() === day.date;
                      return (
                        <button
                          key={index}
                          onClick={() => handleDateClick(day.offset)}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl text-sm transition-all ${
                            isSelected 
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105' 
                              : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <span className={`text-xs ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{day.day}</span>
                          <span className="font-bold mt-1">{day.date}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots */}
                <div className="md:w-1/2 border-l border-slate-100 md:pl-8">
                  <h3 className="font-semibold text-slate-900 mb-4">Available Slots for {selectedDate.toLocaleDateString()}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {generateSlots().map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 px-4 rounded-lg text-sm font-medium border transition-all ${
                          selectedTime === slot
                            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    disabled={!selectedTime}
                    className={`w-full mt-8 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all transform ${
                      selectedTime
                        ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-200'
                        : 'bg-slate-300 cursor-not-allowed'
                    }`}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
