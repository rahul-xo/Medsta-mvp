import React from 'react'
import { FaUser, FaUserMd } from 'react-icons/fa'

const Login = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="max-w-3xl w-full px-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Login</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center">
            <FaUser className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Login as Patient</h3>
            <p className="text-slate-600 mt-2">Access your prescriptions, appointments and medicine orders.</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">Continue as Patient</button>
          </div>

          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center">
            <FaUserMd className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Login as Provider</h3>
            <p className="text-slate-600 mt-2">Manage your clinic, lab, or pharmacy and accept bookings.</p>
            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md">Continue as Provider</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login