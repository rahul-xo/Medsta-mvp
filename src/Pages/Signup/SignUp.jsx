import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create an Account</h1>
          <p className="text-sm text-slate-500 mb-6">Choose how you'd like to sign up</p>

          <div className="flex flex-col gap-4">
            <Link to="/signup/patient" className="block w-full text-left bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700">Sign up as Patient</Link>
            <Link to="/signup/provider" className="block w-full text-left bg-slate-100 text-slate-900 px-4 py-3 rounded-md hover:bg-slate-200">Sign up as Provider</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
