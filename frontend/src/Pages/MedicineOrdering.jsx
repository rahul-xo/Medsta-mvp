import React from 'react';
import { FaPills } from 'react-icons/fa';

export default function MedicineOrdering() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <FaPills className="text-4xl text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-700 mb-2">Medicine Ordering</h1>
          <p className="text-slate-600">Order medicine from partnered pharmacies and get it delivered to your doorstep.</p>
        </header>

        <section>
          <h2 className="text-2xl font-medium mb-4">How it works</h2>
          <ol className="list-decimal list-inside text-slate-600 space-y-2">
            <li>Search for a medicine or upload a prescription.</li>
            <li>Select a partnered pharmacy and place your order.</li>
            <li>Choose delivery or pickup. Track your order in real-time.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
 