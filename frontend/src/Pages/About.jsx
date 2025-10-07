import React from "react";

export default function About() {
  return (
    <div className="py-30 px-4 bg-white text-slate-800">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Medsta – Healthcare, Your Way.</h1>
          <p className="text-lg text-slate-600">One Platform. One Click. Complete Care.</p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
          <p className="text-slate-600 leading-relaxed">
            Healthcare in India’s Tier 2 and Tier 3 cities is broken — fragmented, slow, and inconvenient. People still rely on manual processes, multiple calls, and long travel just to get medicines, visit a doctor, and get lab tests done.
          </p>
          <p className="text-slate-600 leading-relaxed mt-4">
            Medsta is solving this problem by creating a hyper-local digital healthcare ecosystem where everything is connected:
          </p>

          <ul className="list-disc list-inside text-slate-600 mt-4 space-y-2">
            <li>Doctors, pharmacies, labs, physiotherapists, ambulances, and patient transport and other allied services – all in one place</li>
            <li>AI-powered medicine reminders and medical suggestions to keep patients healthier</li>
            <li>Digital-first convenience so patients can book, track, and complete their healthcare journey without stress</li>
          </ul>

          <p className="text-slate-600 leading-relaxed mt-4">
            We exist to make healthcare as simple as ordering food online — but with the trust of local providers.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <blockquote className="border-l-4 border-slate-200 pl-4 text-slate-700 italic">
            "To bring affordable, accessible, and trustworthy healthcare to every household in Bharat by connecting local doctors, labs, pharmacies, physiotherapists, and allied services under one digital roof."
          </blockquote>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
          <p className="text-slate-600 leading-relaxed">
            We envision a future where every Indian can access healthcare within minutes, healthcare is proactive, fitness is integrated, and Medsta is the go-to name for digital health.
          </p>
        </section>
      </div>
    </div>
  );
}
