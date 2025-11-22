import React from 'react';
import { FaSearch, FaSlidersH, FaMapMarkerAlt, FaStar, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function BookAppointment() {
  // Mock data for clinics
  const clinics = [
    {
      id: 1,
      name: "Sunrise Health Clinic",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
      location: "123 Healthcare Ave, Medical District",
      rating: 4.8,
      reviews: 124,
      specialties: ["General Medicine", "Pediatrics"]
    },
    {
      id: 2,
      name: "City Care Medical Center",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=1000",
      location: "45 Downtown Plaza, City Center",
      rating: 4.6,
      reviews: 89,
      specialties: ["Dermatology", "Cosmetology"]
    },
    {
      id: 3,
      name: "Valley Orthopedic Clinic",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=1000",
      location: "78 Valley Road, Green Hills",
      rating: 4.9,
      reviews: 210,
      specialties: ["Orthopedics", "Physiotherapy"]
    },
    {
      id: 4,
      name: "Wellness Family Practice",
      image: "https://images.unsplash.com/photo-1516549655169-df83a092fc72?auto=format&fit=crop&q=80&w=1000",
      location: "12 Community Lane, Suburbs",
      rating: 4.7,
      reviews: 156,
      specialties: ["Family Medicine", "Nutrition"]
    },
    {
      id: 5,
      name: "Heart & Soul Cardiology",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000",
      location: "99 Heartbeat Blvd, Medical Park",
      rating: 4.9,
      reviews: 342,
      specialties: ["Cardiology", "Internal Medicine"]
    },
    {
      id: 6,
      name: "Bright Smile Dental",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
      location: "22 Smile Street, Uptown",
      rating: 4.5,
      reviews: 78,
      specialties: ["Dentistry", "Orthodontics"]
    }
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-12 bg-slate-50 pt-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">Find a Clinic</h1>
          <p className="text-lg text-slate-600 max-w-2xl">Discover top-rated clinics and medical centers near you. Book appointments or order medicines with ease.</p>
        </header>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
          <div className="flex-1 relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"><FaSearch /></span>
            <input
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 placeholder:text-slate-400"
              placeholder="Search by clinic name, specialty, or location..."
            />
          </div>

          <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-700 font-medium">
            <FaSlidersH />
            <span>Filters</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Clinics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </div>
    </div>
  );
}

const ClinicCard = ({ clinic }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={clinic.image} 
          alt={clinic.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
          <FaStar className="text-yellow-400" /> {clinic.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{clinic.name}</h3>
          <div className="flex items-start gap-2 text-slate-500 text-sm mb-3">
            <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-slate-400" />
            <span className="line-clamp-2">{clinic.location}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {clinic.specialties.map((spec, index) => (
              <span key={index} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-100">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex gap-3">
          <Link 
            to={`/clinic/${clinic.id}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors text-center shadow-md shadow-blue-200"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
