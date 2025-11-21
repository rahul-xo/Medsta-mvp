import React, { useEffect, useState } from 'react';
import { supabase } from '@/Services/supabase.js';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/Stores/authStore.js';
import { FaRegCalendarAlt, FaPills, FaFlask, FaAmbulance, FaRobot } from 'react-icons/fa';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState('overview');
  const [labUpcoming, setLabUpcoming] = useState([]);

  const firstName = (user?.user_metadata?.full_name || user?.email || 'there').split(' ')[0].split('@')[0];

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '';
    }
  };

  // Fetch upcoming lab tests
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    const fetchData = async () => {
      try {
        const now = new Date().toISOString();
        const { data: upcoming } = await supabase
          .from('patient_lab_tests')
          .select('*')
          .eq('user_id', user.id)
          .gte('scheduled_at', now)
          .order('scheduled_at', { ascending: true })
          .limit(5);
        
        if (cancelled) return;
        if (upcoming) setLabUpcoming(upcoming);
      } catch (err) {
        console.warn('Profile data fetch error:', err);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with bubble background */}
        <section className="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative bubbles background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden lg:block">
            <div className="absolute top-4 right-10 w-16 h-16 rounded-full bg-sky-300"></div>
            <div className="absolute top-20 right-32 w-12 h-12 rounded-full bg-teal-300"></div>
            <div className="absolute top-32 right-16 w-20 h-20 rounded-full bg-blue-200"></div>
            <div className="absolute top-48 right-40 w-14 h-14 rounded-full bg-cyan-300"></div>
            <div className="absolute bottom-20 right-20 w-18 h-18 rounded-full bg-sky-200"></div>
            <div className="absolute bottom-32 right-48 w-16 h-16 rounded-full bg-teal-200"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-2 text-slate-600">Here's a summary of your health journey.</p>

            {/* Action Buttons */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <Link
                to="/book-appointment"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                <FaRegCalendarAlt />
                <span className="text-sm">Book Appointment</span>
              </Link>
              <Link
                to="/medicine-ordering"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                <FaPills />
                <span className="text-sm">Order Medicines</span>
              </Link>
              <Link
                to="/diagnostic-tests"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                <FaFlask />
                <span className="text-sm">Book Lab Test</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                <FaAmbulance />
                <span className="text-sm">Book Transport</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl transition-colors"
              >
                <FaRobot />
                <span className="text-sm">HealTech-AI</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="mt-8">
          <nav className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <ul className="flex gap-2 px-4 py-3 text-sm sm:text-base">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'appointments', label: 'Appointments' },
                { id: 'orders', label: 'Orders' },
                { id: 'tests', label: 'Lab Tests' },
                { id: 'reports', label: 'Reports' },
                { id: 'cart', label: 'Cart' },
              ].map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      activeTab === tab.id
                        ? 'px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold whitespace-nowrap'
                        : 'px-4 py-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-gray-50 whitespace-nowrap'
                    }
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* No Upcoming Appointments Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              <FaRegCalendarAlt className="text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No upcoming appointments.</h3>
              <Link to="/book-appointment" className="mt-4 text-blue-600 hover:underline text-sm">
                Book one now
              </Link>
            </div>

            {/* No Active Medicine Orders Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              <FaPills className="text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No active medicine orders.</h3>
              <Link to="/medicine-ordering" className="mt-4 text-blue-600 hover:underline text-sm">
                Order now
              </Link>
            </div>

            {/* Upcoming Test Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FaFlask className="text-blue-600" />
                Upcoming Test
              </h3>
              {labUpcoming.length > 0 ? (
                <div className="mt-4">
                  <div className="font-semibold text-gray-900">{labUpcoming[0].name}</div>
                  <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                    <span className="font-medium">{labUpcoming[0].mode}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">At: {labUpcoming[0].center}</div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <FaRegCalendarAlt className="text-gray-400" />
                    {formatDateTime(labUpcoming[0].scheduled_at)}
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-center py-8">
                  <p className="text-gray-600">No upcoming tests scheduled.</p>
                  <Link to="/diagnostic-tests" className="mt-2 text-blue-600 hover:underline text-sm inline-block">
                    Book a test
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Appointments</h2>
            <p className="mt-1 text-gray-600">Manage your upcoming and view past appointments.</p>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming</h3>
              <p className="mt-2 text-gray-600">No upcoming appointments.</p>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">Past</h3>
              <p className="mt-2 text-gray-600">No past appointments.</p>
            </div>
          </section>
        )}

        {activeTab === 'orders' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Medicine Orders</h2>
            <p className="mt-1 text-gray-600">Track your recent medicine deliveries.</p>
            <div className="mt-6">
              <p className="text-gray-600">You have no active orders.</p>
            </div>
          </section>
        )}

        {activeTab === 'tests' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Diagnostic Tests</h2>
            <p className="mt-1 text-gray-600">View your scheduled tests.</p>
            <div className="mt-6 space-y-4">
              {labUpcoming.length === 0 && (
                <p className="text-gray-600">No upcoming tests scheduled.</p>
              )}
              {labUpcoming.map((t) => (
                <article key={t.id} className="border rounded-lg p-4 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">At: {t.center}</p>
                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                      <FaRegCalendarAlt className="text-gray-400" /> {formatDateTime(t.scheduled_at)}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full h-fit">{t.mode}</span>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Medical Reports</h2>
            <p className="mt-1 text-gray-600">Access and download your reports and prescriptions.</p>
            <div className="mt-6">
              <p className="text-gray-600">No reports available yet.</p>
            </div>
          </section>
        )}

        {activeTab === 'cart' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Cart</h2>
            <p className="mt-1 text-gray-600">Items you've added from pharmacies.</p>
            <div className="mt-6">
              <p className="text-gray-600">Your cart is empty.</p>
              <Link to="/medicine-ordering" className="mt-2 text-blue-600 hover:underline inline-block">
                Start Shopping
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
