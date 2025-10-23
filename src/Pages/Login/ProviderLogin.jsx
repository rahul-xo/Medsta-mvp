import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const ProviderLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.role === 'provider') {
          navigate('/provider-dashboard');
        } else if (data.role === 'patient') {
          navigate('/patient-dashboard');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-xl w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Provider Login</h1>
          <p className="text-sm text-slate-500 mb-6">Access your provider dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <button type="submit" disabled={loading} className={`w-full text-white px-4 py-2 rounded-md ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-slate-700">
            <p className="text-sm">
              Are you a patient?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
            </p>
            <p className="text-sm mt-2">
              Don’t have an account?{' '}
              <Link to="/signup/provider" className="text-blue-600 hover:underline">Sign up as provider</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProviderLogin;
