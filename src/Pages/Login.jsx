import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '@/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaUserMd } from 'react-icons/fa';

// This component is the actual login form
const LoginForm = ({ userType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.role === 'patient') {
          navigate('/patient-dashboard');
        } else if (userData.role === 'provider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/'); // Fallback to home if role is not defined
        }
      } else {
        console.error("No user role found in database!");
        navigate('/'); 
      }
    } catch (error) {
      console.error(`Error logging in as ${userType}:`, error);
      alert("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 mt-4">
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
      >
        Login as {userType}
      </button>
    </form>
  );
};

// The main Login page uses the LoginForm twice
const Login = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-12 pt-20">
      <div className="max-w-4xl w-full px-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Welcome Back!</h1>
          <p className="text-slate-600 mt-2">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Patient Login Card */}
          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center flex flex-col">
            <FaUser className="text-4xl text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Login as Patient</h3>
            <p className="text-slate-600 mt-2">Access your prescriptions, appointments and medicine orders.</p>
            <LoginForm userType="Patient" />
          </div>

          {/* Provider Login Card */}
          <div className="p-6 rounded-lg bg-green-50 border border-green-100 text-center flex flex-col">
            <FaUserMd className="text-4xl text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold">Login as Provider</h3>
            <p className="text-slate-600 mt-2">Manage your clinic, lab, or pharmacy and accept bookings.</p>
            <LoginForm userType="Provider" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
