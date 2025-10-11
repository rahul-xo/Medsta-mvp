

import React from 'react';

const OurCoreFeatures = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-semibold text-blue-500 mb-3">Our Core Features</h2>
        <p className="text-slate-600 text-lg mb-12">
          Explore the powerful tools Medsta offers to manage your health seamlessly
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: Doctors */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img src="/Images/30.jpg" alt="Doctors" className="w-full h-80 object-cover"/>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-md">
              <h3 className="font-bold text-slate-800">DOCTORS</h3>
            </div>
          </div>
          {/* Feature 2: Medicines */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img src="/Images/32.jpeg" alt="Medicines" className="w-full h-80 object-cover"/>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-md">
              <h3 className="font-bold text-slate-800">MEDICINES</h3>
            </div>
          </div>
          {/* Feature 3: Tests */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img src="/Images/31.jpeg" alt="Tests" className="w-full h-80 object-cover"/>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-md">
              <h3 className="font-bold text-slate-800">TESTS</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCoreFeatures