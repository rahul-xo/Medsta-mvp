import React from 'react'
import { FaTruck, FaAmbulance, FaHandsHelping } from 'react-icons/fa'

const MedstaForProviders = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center mb-8">Partner with Medsta</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-green-50 rounded-lg shadow border border-green-100 text-center">
            <FaTruck className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Partner with Delivery</h3>
            <p className="text-slate-600">Join our network of delivery partners to fulfill medicine and lab orders in your area.</p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg shadow border border-green-100 text-center">
            <FaAmbulance className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Partner in Transport</h3>
            <p className="text-slate-600">Offer patient transport, ambulance, or cab services to help patients reach care on time.</p>
          </div>

          <div className="p-6 bg-green-50 rounded-lg shadow border border-green-100 text-center">
            <FaHandsHelping className="text-3xl text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Partner with Us</h3>
            <p className="text-slate-600">Register your clinic, lab, or pharmacy to reach more patients through Medsta's marketplace.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MedstaForProviders