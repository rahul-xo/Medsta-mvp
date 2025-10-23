import React from 'react';
import { Link } from 'react-router-dom';

const ProviderSignup = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign up as Provider</h1>
          <p className="text-sm text-slate-500 mb-6">Choose your provider type to continue</p>

          <div className="flex flex-col gap-3 text-left">
            <Link to="/signup/provider/doctor" className="block w-full bg-slate-100 text-slate-900 px-4 py-3 rounded-md hover:bg-slate-200">Doctor</Link>
            <Link to="/signup/provider/diagnostic-center" className="block w-full bg-slate-100 text-slate-900 px-4 py-3 rounded-md hover:bg-slate-200">Diagnostic Center</Link>
            <Link to="/signup/provider/pharmacy" className="block w-full bg-slate-100 text-slate-900 px-4 py-3 rounded-md hover:bg-slate-200">Pharmacy</Link>
            <Link to="/signup/provider/delivery-agent" className="block w-full bg-slate-100 text-slate-900 px-4 py-3 rounded-md hover:bg-slate-200">Delivery Agent</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProviderSignup;
