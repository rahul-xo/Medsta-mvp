import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import AddressPicker from '/src/Components/common/AddressPicker.jsx';
import ToggleSwitch from '/src/Components/common/ToggleSwitch.jsx';
import { linkPhoneToCurrentUser } from '/src/utils/phoneAuth.js';

const DiagnosticCenterSignup = () => {
  const [formData, setFormData] = useState({
    diagnosticCenterName: '',
    email: '',
    phone: '',
    diagnosticLicenseNumber: '',
    diagnosticAddress: '',
    diagnosticLat: null,
    diagnosticLng: null,
    diagnosticOpeningHours: '',
    atHomeSampleCollection: false,
    reportDelivery: false,
    password: '',
    confirmPassword: '',
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  const isValid = () => {
    return !!(
      formData.diagnosticCenterName &&
      formData.email &&
      formData.diagnosticAddress &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // users metadata
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: 'provider',
        providerRole: 'diagnostic_center',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // profile doc
      await setDoc(doc(db, 'providers_diagnostic_centers', user.uid), {
        diagnosticCenterName: formData.diagnosticCenterName,
        diagnosticLicenseNumber: formData.diagnosticLicenseNumber || null,
        diagnosticAddress: formData.diagnosticAddress || null,
        diagnosticLat: formData.diagnosticLat || null,
        diagnosticLng: formData.diagnosticLng || null,
        diagnosticOpeningHours: formData.diagnosticOpeningHours || null,
        atHomeSampleCollection: !!formData.atHomeSampleCollection,
        reportDelivery: !!formData.reportDelivery,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (formData.phone) {
        try {
          await linkPhoneToCurrentUser(formData.phone);
        } catch (e) {
          console.warn('Phone linking failed:', e);
        }
      }
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`Sign up failed: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Create a Diagnostic Center Account</h1>
          <p className="text-sm text-slate-500 mb-6">Serve patients with lab services through HealTech.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Diagnostic Center Name</label>
              <input
                type="text"
                name="diagnosticCenterName"
                value={formData.diagnosticCenterName}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticCenterName: e.target.value }))}
                placeholder="City Labs"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Center License Number</label>
              <input
                type="text"
                name="diagnosticLicenseNumber"
                value={formData.diagnosticLicenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticLicenseNumber: e.target.value }))}
                placeholder="License Number"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <AddressPicker
              label="Address"
              placeholder="Full diagnostic address"
              address={formData.diagnosticAddress}
              onChange={(addr) => setFormData(prev => ({ ...prev, diagnosticAddress: addr }))}
              lat={formData.diagnosticLat}
              lng={formData.diagnosticLng}
              onLocationChange={({ lat, lng }) => setFormData(prev => ({ ...prev, diagnosticLat: lat, diagnosticLng: lng }))}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Opening Hours</label>
              <input
                type="text"
                name="diagnosticOpeningHours"
                value={formData.diagnosticOpeningHours}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticOpeningHours: e.target.value }))}
                placeholder="e.g. 9 AM - 9 PM"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                checked={formData.atHomeSampleCollection}
                onChange={(v) => setFormData(prev => ({ ...prev, atHomeSampleCollection: v }))}
                label="At-Home Sample Collection"
                description="Do you offer sample collection from home?"
              />

              <ToggleSwitch
                checked={formData.reportDelivery}
                onChange={(v) => setFormData(prev => ({ ...prev, reportDelivery: v }))}
                label="Report Delivery"
                description="Do you offer home delivery of reports?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password (min. 6 characters)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            {!isValid() && submitAttempted && (
              <p className="text-xs text-red-600">Please fill all required fields and ensure passwords match.</p>
            )}
            <button type="submit" disabled={!isValid()} className={`w-full text-white px-4 py-2 rounded-md ${isValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'}`}>Sign Up</button>
          </form>

          <p className="text-slate-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
        </div>
      </div>
    </main>
  );
};

export default DiagnosticCenterSignup;
