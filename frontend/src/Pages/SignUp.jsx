import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase.js'; // Corrected import path
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('patient'); // Default role is patient
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info and role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        role, // Save the selected role
      });

      navigate('/login');
    } catch (error) {
      console.error("Error signing up:", error);
      alert(`Sign up failed: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-12">
      <div className="max-w-md w-full px-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Create an Account</h1>
        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Role Selection */}
          <div className="flex justify-around mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="patient"
                checked={role === 'patient'}
                onChange={() => setRole('patient')}
                className="form-radio text-green-600 h-4 w-4"
              />
              <span className="text-slate-700">I am a Patient</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="provider"
                checked={role === 'provider'}
                onChange={() => setRole('provider')}
                className="form-radio text-green-600 h-4 w-4"
              />
              <span className="text-slate-700">I am a Provider</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password (min. 6 characters)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
         <p className="text-slate-600 mt-4 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
      </div>
    </main>
  );
};

export default SignUp;