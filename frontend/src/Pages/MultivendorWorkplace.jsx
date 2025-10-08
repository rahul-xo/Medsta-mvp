import React from 'react'
import { FaUserMd, FaFlask, FaStore } from 'react-icons/fa'

const MultivendorWorkplace = () => {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700">Multivendor Marketplace</h1>
          <p className="text-slate-600 mt-3">Connect doctors, labs, pharmacies and allied providers with patients nearby.</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center">
            <FaUserMd className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Doctors</h3>
            <p className="text-slate-600 mt-2">List your clinic and accept appointments online.</p>
          </div>

          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center">
            <FaFlask className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Labs</h3>
            <p className="text-slate-600 mt-2">Offer diagnostic services and schedule home sample collections.</p>
          </div>

          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center">
            <FaStore className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Pharmacies</h3>
            <p className="text-slate-600 mt-2">Sell medicines online and manage deliveries through our partners.</p>
          </div>
        </section>

        <section className="text-center">
          <p className="text-slate-700 mb-4">Join Medsta's marketplace and reach thousands of patients in your city.</p>
          <div className="flex justify-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-md shadow hover:bg-green-700">Get Started</button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default MultivendorWorkplace