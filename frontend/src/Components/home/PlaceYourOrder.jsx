import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const PlaceYourOrder = () => {
  return (
    <section className="py-16 bg-slate-50 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        
        <h2 className="text-5xl font-semibold text-blue-600 mb-10">Place your order</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Web/App Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 rounded-full p-3 mb-4 flex items-center justify-center h-20 w-20">
               <img src="/Images/logo.png" alt="Web/App" className="h-16 w-16 object-contain" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Web/App</h3>
          </div>

          {/* Whatsapp Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow">
            <div className="bg-green-100 rounded-full p-4 mb-4 flex items-center justify-center h-20 w-20">
              <FaWhatsapp className="text-green-500 text-4xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Whatsapp</h3>
          </div>

          {/* Call Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 rounded-full p-4 mb-4 flex items-center justify-center h-20 w-20">
              <FaPhone className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Call</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-left max-w-3xl mx-auto">
          <h4 className="font-bold text-lg text-gray-900 mb-2">Your Choice: Total Convenience or Extra Savings.</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <span className="font-semibold">Enjoy Home Delivery:</span> Relax and we’ll bring your order to you.
            </li>
            <li>
              <span className="font-semibold">Prefer to Save?</span> Opt for Self-Pickup to get extra discount and skip the line in-store.
            </li>
          </ul>
        </div>
        
      </div>
    </section>
  );
};

export default PlaceYourOrder;
