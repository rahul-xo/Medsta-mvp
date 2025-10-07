import React from 'react';
import { FaSearch, FaSlidersH } from 'react-icons/fa';

export default function BookAppointment() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold text-blue-600 mb-3">Find a Doctor</h1>
          <p className="text-slate-600">Search for doctors by name, specialization, or location.</p>
        </header>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><FaSearch /></span>
            <input
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-100 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Search by name, specialization, or location..."
            />
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50">
            <FaSlidersH />
            <span>Filters</span>
          </button>
        </div>

        <h2 className="text-2xl text-blue-600 font-medium mb-4">Featured Clinics</h2>

        {/* Placeholder content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">Clinic card</div>
          <div className="p-6 bg-white rounded-lg shadow">Clinic card</div>
        </div>
      </div>
    </div>
  );
}
