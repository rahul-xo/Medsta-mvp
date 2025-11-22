import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaPhone, FaEnvelope, FaUserMd, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const ClinicProfile = () => {
  const { id } = useParams();
  const [showDoctors, setShowDoctors] = useState(false);
  const doctorsSectionRef = useRef(null);

  // Mock data - in a real app, fetch based on ID
  const clinic = {
    id: id,
    name: "Sunrise Health Clinic",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
    location: "123 Healthcare Ave, Medical District",
    rating: 4.8,
    reviews: 124,
    description: "Sunrise Health Clinic is dedicated to providing top-notch medical care with a focus on patient comfort and advanced treatments. Our team of experienced specialists ensures you receive the best possible care.",
    specialties: ["General Medicine", "Pediatrics", "Dermatology", "Orthopedics"],
    timings: "Mon - Sat: 9:00 AM - 8:00 PM"
  };

  const doctors = [
    {
      id: 1,
      name: "Dr. Emily Carter",
      specialty: "General Medicine",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      availability: "Mon, Wed, Fri: 10:00 AM - 2:00 PM",
      fee: 500
    },
    {
      id: 2,
      name: "Dr. James Wilson",
      specialty: "Pediatrics",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
      availability: "Tue, Thu: 4:00 PM - 8:00 PM",
      fee: 600
    },
    {
      id: 3,
      name: "Dr. Sarah Chen",
      specialty: "Dermatology",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300",
      availability: "Mon - Fri: 9:00 AM - 1:00 PM",
      fee: 800
    },
    {
      id: 4,
      name: "Dr. Michael Ross",
      specialty: "Orthopedics",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
      availability: "Sat: 10:00 AM - 4:00 PM",
      fee: 1000
    }
  ];

  const handleBookAppointment = () => {
    setShowDoctors(true);
    setTimeout(() => {
      doctorsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/book-appointment" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 transition-colors">
          <FaArrowLeft /> Back to Clinics
        </Link>

        {/* Clinic Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="h-64 sm:h-80 w-full relative">
            <img 
              src={clinic.image} 
              alt={clinic.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
              <div className="p-6 sm:p-8 text-white w-full">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{clinic.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm sm:text-base">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-sky-400" /> {clinic.location}</span>
                  <span className="flex items-center gap-1.5"><FaStar className="text-yellow-400" /> {clinic.rating} ({clinic.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">About Us</h2>
                  <p className="text-slate-600 leading-relaxed">{clinic.description}</p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {clinic.specialties.map((spec, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                        {spec}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-4">Contact Info</h3>
                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <FaPhone className="text-slate-400 mt-1" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaEnvelope className="text-slate-400 mt-1" />
                      <span>contact@sunriseclinic.com</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-slate-400 mt-1" />
                      <span>{clinic.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleBookAppointment}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <FaUserMd /> Book Appointment
                  </button>
                  <button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5">
                    Order Medicine
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        {showDoctors && (
          <div ref={doctorsSectionRef} className="animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaUserMd className="text-blue-600" /> Available Doctors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex gap-4">
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg">{doctor.name}</h3>
                    <p className="text-blue-600 text-sm font-medium mb-2">{doctor.specialty}</p>
                    
                    <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-slate-400" />
                        <span>{doctor.availability}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMoneyBillWave className="text-emerald-500" />
                        <span className="font-semibold text-slate-900">₹{doctor.fee}</span>
                        <span className="text-xs text-slate-500">Consultation Fee</span>
                      </div>
                    </div>

                    <Link 
                      to={`/doctor/${doctor.id}`}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors block text-center"
                    >
                      Book Visit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicProfile;
