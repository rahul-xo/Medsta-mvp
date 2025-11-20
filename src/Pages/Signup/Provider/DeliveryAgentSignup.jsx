import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/Services/supabase.js';

const DeliveryAgentSignup = () => {
  const [formData, setFormData] = useState({
    deliveryFullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    setError(null);
    if (!isValid()) return;

    setIsLoading(true);
    let authUser = null;

    try {
      // Step 1: Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.deliveryFullName,
            role: 'provider',
            provider_role: 'delivery_agent'
          }
        }
      });

      if (authError) throw authError;
      authUser = authData.user;

      if (authUser) {
        // Step 2: Create user metadata document
        const { error: userError } = await supabase.from('users').insert({
          id: authUser.id,
          email: formData.email,
          role: 'provider',
          provider_role: 'delivery_agent',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (userError && userError.code !== '23505') {
           console.warn("User creation warning:", userError);
        }

        // Step 3: Create detailed profile
        const { error: profileError } = await supabase.from('providers_delivery_agents').insert({
          id: authUser.id,
          delivery_full_name: formData.deliveryFullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

        setIsLoading(false);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message || 'Sign up failed');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1">
            Create a Delivery Agent Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">Deliver health services and medicines with Medsta.</p>

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

            {(error || (!isValid() && submitAttempted)) && (
              <p className="text-sm text-red-600 mt-2">
                {error || 'Please fill all required fields and ensure passwords match.'}
              </p>
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
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <p className="text-slate-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
        </div>
      </div>
    </main>
  );
};

export default DeliveryAgentSignup;