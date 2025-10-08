import React from 'react';
import { FaFileMedical } from 'react-icons/fa';

export default function DiagnosticTests() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <FaFileMedical className="text-4xl text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-semibold text-green-700 mb-2">Diagnostic Tests</h1>
          <p className="text-slate-600">Book diagnostic tests from partnered labs and get samples collected from home.</p>
        </header>

        <section>
          <h2 className="text-2xl font-medium mb-4">Available Tests</h2>
          <p className="text-slate-600">Search and book common lab tests like CBC, Lipid Profile, Blood Sugar, and more.</p>
        </section>
      </div>
    </div>
  );
}
