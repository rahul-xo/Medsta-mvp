// frontend/src/Components/home/MedstaForProviders.jsx

import React from 'react';

const MedstaForProviders = () => {
  return (
    // UPDATED: Removed background color for a simpler look
    <section className="py-8 bg-white text-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header with font and color matching 'Get in Touch' */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-blue-500 mb-4">
            Medsta for Providers
          </h2>
          <p className="text-lg text-gray-700">
            Join our network and grow with us.
          </p>
        </div>

        {/* Grid container for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          
          {/* Card 1: Partner with us */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center w-full max-w-sm transition-transform hover:scale-105" style={{ minHeight: '320px' }}>
            <div className="w-24 h-24 bg-blue-400 rounded-full mb-6 flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Partner with us</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow">For Doctors, Labs, Pharmacies...</p>
            <button className="bg-blue-400 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200">
              Register Now
            </button>
          </div>

          {/* Card 2: Join our fleet */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center w-full max-w-sm transition-transform hover:scale-105" style={{ minHeight: '320px' }}>
            <div className="w-24 h-24 bg-blue-400 rounded-full mb-6 flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join our fleet</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow">For Delivery Agents</p>
            <button className="bg-blue-400 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200">
              Register Now
            </button>
          </div>

          {/* Card 3: Join as Affiliate */}
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center w-full max-w-sm transition-transform hover:scale-105" style={{ minHeight: '320px' }}>
            <div className="w-24 h-24 bg-blue-400 rounded-full mb-6 flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Join as Affiliate</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow">Earn with Medsta</p>
            <button className="bg-blue-400 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-md transition-colors duration-200">
              Register Now
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MedstaForProviders;