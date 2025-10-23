import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const DeliveryAgentSignup = () => {
  const [formData, setFormData] = useState({
    deliveryFullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  const isValid = () => {
    return !!(
      formData.deliveryFullName &&
      formData.email &&
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

      // users: routing metadata
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: 'provider',
        providerRole: 'delivery_agent',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // providers_delivery_agents: detailed profile
      await setDoc(doc(db, 'providers_delivery_agents', user.uid), {
        deliveryFullName: formData.deliveryFullName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
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
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Create a Delivery Agent Account</h1>
          <p className="text-sm text-slate-500 mb-6">Deliver health services and medicines with HealTech.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="deliveryFullName"
                value={formData.deliveryFullName}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryFullName: e.target.value }))}
                placeholder="John Doe"
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

export default DeliveryAgentSignup;
