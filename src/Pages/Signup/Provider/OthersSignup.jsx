import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '@/Services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import AddressPicker from '/src/Components/common/AddressPicker.jsx';
import OtpModal from '/src/Components/common/OtpModal.jsx';
import { startPhoneLinking } from '@/Services/phone.service.js';
import { ensureAuthReady } from '@/Services/auth.helpers.js';

const OthersSignup = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    email: '',
    phone: '',
    address: '',
    lat: null,
    lng: null,
    openingHours: '',
    password: '',
    confirmPassword: '',
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const navigate = useNavigate();

  const isValid = () => {
    return !!(
      formData.businessName &&
      formData.email &&
      formData.address &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);
    if (!isValid()) return;

    setIsLoading(true);
    let authUser = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      authUser = userCredential.user;
      await ensureAuthReady(auth, authUser.uid);

      try {
        await setDoc(doc(db, 'users', authUser.uid), {
          email: formData.email,
          role: 'provider',
          providerRole: 'others',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        await setDoc(doc(db, 'providers_others', authUser.uid), {
          businessName: formData.businessName,
          category: formData.category || null,
          address: formData.address || null,
          lat: formData.lat || null,
          lng: formData.lng || null,
          email: formData.email || null,
          phone: formData.phone || null,
          openingHours: formData.openingHours || null,
          services: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        if (formData.phone) {
          try {
            const confirmation = await startPhoneLinking(formData.phone);
            setPendingConfirmation(confirmation);
            setOtpOpen(true);
            await new Promise((resolve) => {
              const check = () => {
                if (!otpOpen) resolve();
                else setTimeout(check, 100);
              };
              check();
            });
          } catch (e) {
            console.warn('Phone linking start failed:', e);
          }
        }

        setIsLoading(false);
        navigate('/login');
      } catch (firestoreError) {
        if (authUser) {
          try { await authUser.delete(); } catch { /* ignore cleanup errors */ }
        }
        throw firestoreError;
      }
    } catch (err) {
      console.error('Others signup failed:', err);
      setError(err.message || 'Failed to create account.');
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (code) => {
    if (!pendingConfirmation) { setOtpOpen(false); return; }
    try {
      setIsOtpSubmitting(true);
      await pendingConfirmation.confirm(code);
      setPendingConfirmation(null);
      setOtpOpen(false);
    } catch (e) {
      setIsOtpSubmitting(false);
      setError(e.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 pt-20">
      <div className="max-w-2xl w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1">Create an Account (Others)</h1>
          <p className="text-sm text-slate-500 mb-6">Register other healthcare-related services on Medsta.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business/Service Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData((p) => ({ ...p, businessName: e.target.value }))}
                placeholder="e.g. Wellness Supplies"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                placeholder="e.g. Equipment Rental, Home Care"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <AddressPicker
              label="Address"
              placeholder="Full business address"
              address={formData.address}
              onChange={(addr) => setFormData((p) => ({ ...p, address: addr }))}
              lat={formData.lat}
              lng={formData.lng}
              onLocationChange={({ lat, lng }) => setFormData((p) => ({ ...p, lat, lng }))}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Opening Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData((p) => ({ ...p, openingHours: e.target.value }))}
                placeholder="e.g. 9 AM - 9 PM"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password (min. 6 characters)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            {(error || (!isValid() && submitAttempted)) && (
              <p className="text-sm text-red-600 mt-2">{error || 'Please fill all required fields and ensure passwords match.'}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isValid() && submitAttempted)}
              className={`w-full ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : !isValid() && submitAttempted
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              } text-white px-4 py-2 rounded-md flex items-center justify-center`}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-slate-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
        </div>
      </div>
      <OtpModal
        open={otpOpen}
        phone={formData.phone}
        onSubmit={handleOtpSubmit}
        onClose={() => setOtpOpen(false)}
        isSubmitting={isOtpSubmitting}
      />
    </main>
  );
};

export default OthersSignup;
