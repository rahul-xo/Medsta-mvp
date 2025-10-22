import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { linkPhoneToCurrentUser } from '/src/utils/phoneAuth.js';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dob: '',
    gender: '',
    bloodGroup: '',
  });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // users: routing metadata only
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: 'patient',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // patients: detailed profile
      await setDoc(doc(db, 'patients', user.uid), {
        fullName: formData.fullName,
        dob: formData.dob || null,
        gender: formData.gender || null,
        bloodGroup: formData.bloodGroup || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Link phone number to Firebase Auth account if provided (requires E.164, e.g., +91XXXXXXXXXX)
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
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Create a Patient Account</h1>
          <p className="text-sm text-slate-500 mb-6">Sign up to manage your health with HealTech.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
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

            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">Sign Up</button>
          </form>

          <p className="text-slate-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
        </div>
      </div>
    </main>
  );
};

export default PatientSignup;
