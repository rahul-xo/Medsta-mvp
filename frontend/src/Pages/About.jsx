import React from 'react';

export default function About() {
  return (
    <div className="py-20 px-4 bg-white text-slate-800">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-slate-900">
            Ab Aapka Apna Medical, Doctor aur Diagnostic Center – Medsta Pe!
          </h1>
          <p className="text-lg text-slate-600">
            Simplifying Healthcare for Bharat.
          </p>
        </header>

        {/* --- Who We Are Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Who We Are</h2>
          <p className="text-slate-600 leading-relaxed">
            Medsta is a hyper-local digital healthcare marketplace built to make healthcare simple, affordable, and accessible across India’s Tier 2 and Tier 3 cities. Headquartered in Barabanki, Uttar Pradesh, we bring together patients, doctors, pharmacies, diagnostic centers, physiotherapists, and ambulance services on one unified platform — so people can get healthcare support anytime, anywhere.
          </p>
        </section>

        {/* --- What We Do Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">What We Do</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Medsta connects users to trusted healthcare providers through both our mobile app and website, making healthcare as easy as ordering food online. Users can:
          </p>
          <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
            <li>Book doctor appointments (online or offline)</li>
            <li>Order medicines from local pharmacies for home delivery or self-pickup</li>
            <li>Book lab tests and diagnostics (with home sample pickup or center visit)</li>
            <li>Access physiotherapy and wellness services</li>
            <li>Book ambulances and emergency transport</li>
            <li>Store and manage prescriptions, health reports, and medical history digitally</li>
          </ul>
        </section>

        {/* --- Our Mission Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed">
            Our mission is to make organized, reliable, and tech-powered healthcare accessible to every Indian household. Medsta bridges the digital divide by combining local trust with digital convenience, empowering both patients and healthcare providers to grow together.
          </p>
        </section>

        {/* --- How Medsta Is Beneficial Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">How Medsta Is Beneficial</h2>
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">For Users:</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Order or book through App, Website, WhatsApp, or Call</li>
                <li>Choose home delivery or self-pickup</li>
                <li>Access verified doctors and affordable services</li>
                <li>Get transparent pricing and fast support</li>
                <li>Book ambulances and health services instantly</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Providers:</h3>
              <ul className="list-disc list-inside text-slate-600 space-y-2">
                <li>Grow their business digitally and reach more patients</li>
                <li>Get listed and manage bookings, inventory, and records</li>
                <li>Partner for increased trust and brand visibility</li>
                <li>Use digital tools for appointments and reports</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- Our Core Values Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <ul className="space-y-3">
            <li className="text-slate-600"><strong>Trust First:</strong> Work only with verified and licensed providers.</li>
            <li className="text-slate-600"><strong>Accessibility:</strong> Healthcare for every Indian, regardless of tech literacy.</li>
            <li className="text-slate-600"><strong>Transparency:</strong> Honest pricing and clarity in services.</li>
            <li className="text-slate-600"><strong>Innovation:</strong> Leveraging AI and tech for efficient care.</li>
            <li className="text-slate-600"><strong>Community:</strong> Empowering local doctors, clinics, and pharmacies.</li>
          </ul>
        </section>

        {/* --- Our Vision Section --- */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <blockquote className="border-l-4 border-blue-500 pl-4 text-slate-700 italic text-lg">
            To make Medsta the go-to healthcare companion for every Indian household, where booking a doctor, ordering medicines, or getting a checkup is just a click, call, or message away — all through one trusted platform.
          </blockquote>
        </section>
        
        {/* --- Footer Info --- */}
        <footer className="text-center mt-16 border-t border-slate-200 pt-8">
            <p className="text-slate-600 font-semibold">
              🌐 Website: <a href="http://medsta.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">medsta.in</a>
            </p>
            <p className="text-slate-500 mt-2">
              📍 Based in: Barabanki, Uttar Pradesh, India
            </p>
        </footer>
      </div>
    </div>
  );
}