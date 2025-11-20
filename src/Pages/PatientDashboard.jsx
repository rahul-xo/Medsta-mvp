import React, { useEffect, useState } from 'react';
import { db } from '@/Services/firebase.js';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/Stores/authStore.js';
import { useLocationStore } from '@/Stores/locationStore.js';
import { FaRegCalendarAlt, FaPills, FaFlask, FaAmbulance, FaRobot, FaFileAlt, FaDownload, FaShoppingCart, FaUserCircle, FaUserMd, FaHospital, FaSearch } from 'react-icons/fa';

const PatientDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'appointments' | 'orders' | 'tests' | 'reports' | 'cart'
  const location = useLocation();

  // Sync tab from URL query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get('tab');
    if (t) setActiveTab(t);
  }, [location.search]);
  const requestLocation = useLocationStore((s) => s.requestLocation);
  const initLocation = useLocationStore((s) => s.initFromStorage);

  useEffect(() => {
    // Load saved location and then ask permission once on dashboard mount
    initLocation();
    requestLocation();
  }, [initLocation, requestLocation]);

  const firstName = (user?.displayName || user?.email || 'there').split(' ')[0].split('@')[0];

  const formatDateTime = (ts) => {
    if (!ts) return '';
    try {
      const d = ts instanceof Date ? ts : new Date(ts.seconds ? ts.seconds * 1000 : ts);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return '';
    }
  };

    // Firestore-driven data
    const [labUpcoming, setLabUpcoming] = useState([]);
    const [labUpcomingLast, setLabUpcomingLast] = useState(null);
    const [reportsData, setReportsData] = useState([]);
    const [reportsLast, setReportsLast] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    // Seed minimal sample data for the logged-in user if collections are empty
    useEffect(() => {
      if (!user?.uid) return;
      (async () => {
        // Lab tests
        const labQ = query(
          collection(db, 'patient_lab_tests'),
          where('userId', '==', user.uid),
          limit(1)
        );
        const labSnap = await getDocs(labQ);
        if (labSnap.empty) {
          const future = Timestamp.fromDate(new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)); // +14 days
          const past = Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)); // -30 days
          await addDoc(collection(db, 'patient_lab_tests'), {
            userId: user.uid,
            name: 'Complete Blood Count (CBC)',
            mode: 'At-Center',
            center: 'City Central Imaging',
            scheduledAt: future,
          });
          await addDoc(collection(db, 'patient_lab_tests'), {
            userId: user.uid,
            name: 'Thyroid Profile',
            mode: 'At-Home',
            center: 'Valley Path Labs',
            scheduledAt: past,
          });
        }

        // Reports
        const repQ = query(collection(db, 'patient_reports'), where('userId', '==', user.uid), limit(1));
        const repSnap = await getDocs(repQ);
        if (repSnap.empty) {
          await addDoc(collection(db, 'patient_reports'), {
            userId: user.uid,
            title: 'Lipid Profile Report',
            from: 'Valley Path Labs',
            date: Timestamp.fromDate(new Date('2024-07-10')),
            fileUrl: 'https://example.com/lipid-profile.pdf',
          });
          await addDoc(collection(db, 'patient_reports'), {
            userId: user.uid,
            title: 'Chest X-Ray Analysis',
            from: 'City Central Imaging',
            date: Timestamp.fromDate(new Date('2024-06-25')),
            fileUrl: 'https://example.com/chest-xray.pdf',
          });
        }

        // Cart
        const cartRef = doc(db, 'patient_carts', user.uid);
        const cartDoc = await getDoc(cartRef);
        if (!cartDoc.exists()) {
          await setDoc(cartRef, {
            items: [
              { id: 'med-1', name: 'Paracetamol 500mg', qty: 2, price: 25, pharmacy: 'City Pharmacy' },
              { id: 'med-2', name: 'Cough Syrup 100ml', qty: 1, price: 120, pharmacy: 'HealthPlus Store' },
            ],
            updatedAt: Timestamp.now(),
          });
        }
      })();
    }, [user?.uid]);

    // Fetchers with offline-safe handling
    useEffect(() => {
      if (!user?.uid) return;
      let cancelled = false;
      const fetchAll = async () => {
        try {
          const nowTs = Timestamp.fromDate(new Date());
          const qUpcoming = query(
            collection(db, 'patient_lab_tests'),
            where('userId', '==', user.uid),
            where('scheduledAt', '>=', nowTs),
            orderBy('scheduledAt', 'asc'),
            limit(5)
          );
          const snap = await getDocs(qUpcoming);
          if (cancelled) return;
          const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setLabUpcoming(items);
          setLabUpcomingLast(snap.docs[snap.docs.length - 1] || null);

          const qReports = query(
            collection(db, 'patient_reports'),
            where('userId', '==', user.uid),
            orderBy('date', 'desc'),
            limit(5)
          );
          const rSnap = await getDocs(qReports);
          if (cancelled) return;
          setReportsData(rSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
          setReportsLast(rSnap.docs[rSnap.docs.length - 1] || null);

          const cartRef = doc(db, 'patient_carts', user.uid);
          const cDoc = await getDoc(cartRef);
          if (cancelled) return;
          setCartItems(cDoc.exists() ? cDoc.data().items || [] : []);
        } catch (err) {
          // Handle offline or transient errors gracefully
          if (err?.code === 'unavailable' || err?.message?.includes('offline')) {
            // Try again when the browser comes back online
            const onOnline = () => {
              window.removeEventListener('online', onOnline);
              if (!cancelled) fetchAll();
            };
            window.addEventListener('online', onOnline);
          } else {
            console.warn('Dashboard data fetch error:', err);
          }
        }
      };
      fetchAll();
      return () => { cancelled = true; };
    }, [user?.uid]);

    const loadMoreUpcoming = async () => {
      if (!user?.uid || !labUpcomingLast) return;
      const nowTs = Timestamp.fromDate(new Date());
      const qMore = query(
        collection(db, 'patient_lab_tests'),
        where('userId', '==', user.uid),
        where('scheduledAt', '>=', nowTs),
        orderBy('scheduledAt', 'asc'),
        startAfter(labUpcomingLast),
        limit(5)
      );
      const snap = await getDocs(qMore);
      setLabUpcoming((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]);
      setLabUpcomingLast(snap.docs[snap.docs.length - 1] || null);
    };

    const loadMoreReports = async () => {
      if (!user?.uid || !reportsLast) return;
      const qMore = query(
        collection(db, 'patient_reports'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        startAfter(reportsLast),
        limit(5)
      );
      const snap = await getDocs(qMore);
      setReportsData((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]);
      setReportsLast(snap.docs[snap.docs.length - 1] || null);
    };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top search bar */}
        <div className="mb-4 flex flex-col items-center">
          <div className="relative w-full max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search for doctors, medicines, tests, diagnostics and more..."
              className="w-full h-12 rounded-2xl bg-white shadow-sm pl-5 pr-12 text-slate-700 placeholder:text-slate-400 border border-slate-200"
            />
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          {/* Small nav below search */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-8 text-sm">
            <Link to="/book-appointment" className="inline-flex items-center gap-2 text-slate-600 hover:text-sky-700"><FaUserMd className="text-sky-600" /> Doctors</Link>
            <Link to="/medicine-ordering" className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-700"><FaPills className="text-rose-500" /> Medicines</Link>
            <Link to="/diagnostic-tests" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-700"><FaFlask className="text-indigo-500" /> Tests</Link>
            <Link to="/about" className="inline-flex items-center gap-2 text-slate-600 hover:text-purple-700"><FaHospital className="text-purple-500" /> Hospitals</Link>
          </div>
        </div>
        {/* Header summary block matching the reference */}
        <section className="bg-gradient-to-r from-sky-50 to-emerald-50 rounded-2xl shadow-sm p-6 sm:p-8">
          {/* 12-col grid to keep greeting + 3 cards on one row */}
          <div className="grid grid-cols-12 gap-4">
            {/* Greeting card */}
            <div className="col-span-12 lg:col-span-6 bg-white/70 rounded-xl p-6 sm:p-7 border border-white/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 text-lg font-semibold">🧑</div>
                <div className="text-green-500 text-xs">●</div>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">Welcome back, {firstName}!</h1>
              <p className="mt-2 text-sm text-slate-600">Here's your health overview for today</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                <span>Last updated: 2 min ago</span>
                <span>•</span>
                <span>All systems healthy</span>
              </div>
            </div>

            {/* Appointments */}
            <SummaryCard
              title="Appointments"
              primary={`${labUpcoming.length || 0} Upcoming`}
              secondary={labUpcoming[0]?.scheduledAt ? `Next: ${formatDateTime(labUpcoming[0].scheduledAt)}` : 'No upcoming'}
              icon={<FaRegCalendarAlt className="text-sky-600" />}
              className="col-span-12 sm:col-span-6 lg:col-span-2"
            />

            {/* Orders */}
            <SummaryCard
              title="Orders"
              primary={`${Math.max(cartItems.length, 0)} Active Orders`}
              secondary={cartItems.length ? '1 arriving today' : 'No active orders'}
              icon={<FaPills className="text-emerald-600" />}
              className="col-span-12 sm:col-span-6 lg:col-span-2"
            />

            {/* Reports */}
            <SummaryCard
              title="Reports"
              primary={`${reportsData.length || 0} Reports`}
              secondary={reportsData.length ? 'Ready in 2 hours' : 'No pending reports'}
              icon={<FaFileAlt className="text-rose-600" />}
              className="col-span-12 sm:col-span-6 lg:col-span-2"
            />
          </div>
        </section>

        {/* Promo banner */}
        <section className="mt-6 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-2xl shadow-md p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">📚</div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide">Limited Time • Ends in 2 days</div>
                <h3 className="text-2xl sm:text-3xl font-extrabold">Exclusive Offer</h3>
                <p className="text-white/90 mt-1">Get up to 50% off on health checkups</p>
                <p className="text-white/70 text-xs">Valid for premium members only</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <div className="text-5xl font-extrabold">50%</div>
                <div className="-mt-2 text-white/90 font-semibold">OFF</div>
              </div>
              <Link to="/diagnostic-tests" className="bg-white text-sky-700 hover:bg-slate-100 font-semibold px-6 py-3 rounded-xl">Claim Now →</Link>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mt-6">
          <nav className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <ul className="flex gap-3 sm:gap-4 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'appointments', label: 'Appointments' },
                { id: 'orders', label: 'Orders' },
                { id: 'tests', label: 'Tests' },
                { id: 'reports', label: 'Reports' },
                { id: 'cart', label: 'Cart' },
              ].map((tab) => (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={
                      activeTab === tab.id
                        ? 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-md bg-blue-50 text-blue-700 font-semibold'
                        : 'px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                    }
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Tab panels */}
        {activeTab === 'overview' && (
          <>
            {/* Three primary cards exactly like the reference */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Upcoming Appointment */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-slate-900 font-semibold">Upcoming Appointment</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                    <FaUserCircle className="text-2xl" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Dr. Sarah Johnson</div>
                    <div className="text-slate-500 text-sm">Tomorrow, 10:30 AM</div>
                  </div>
                </div>
              </div>

              {/* Active Orders */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-slate-900 font-semibold">Active Orders</h3>
                <div className="mt-3 text-slate-600 text-sm">Order #12345 <span className="text-emerald-600 font-semibold float-right">In Transit</span></div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[60%] bg-emerald-500"></div>
                </div>
                <div className="mt-2 text-xs text-slate-500">Expected delivery: Today</div>
              </div>

              {/* Upcoming Tests */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-slate-900 font-semibold">Upcoming Tests</h3>
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaFlask className="text-xl" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-medium">Blood Test</div>
                    <div className="text-slate-500 text-sm">Friday, 9:00 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* OFFERS grid */}
            <section className="mt-10">
              <h2 className="text-center text-2xl font-extrabold text-slate-900 tracking-tight">OFFERS</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-sky-500 to-teal-500 shadow-sm">
                  <div className="text-5xl font-extrabold">50%</div>
                  <div className="mt-1 text-white/90">Off on health checkups</div>
                  <Link to="/diagnostic-tests" className="mt-6 inline-flex items-center gap-2 bg-white text-sky-700 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl">View Offer</Link>
                </div>
                <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-emerald-500 to-lime-500 shadow-sm">
                  <div className="text-5xl font-extrabold">30%</div>
                  <div className="mt-1 text-white/90">Off on medicines</div>
                  <Link to="/medicine-ordering" className="mt-6 inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl">View Offer</Link>
                </div>
                <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-rose-500 to-orange-500 shadow-sm">
                  <div className="text-5xl font-extrabold">25%</div>
                  <div className="mt-1 text-white/90">Off on lab tests</div>
                  <Link to="/diagnostic-tests" className="mt-6 inline-flex items-center gap-2 bg-white text-rose-700 hover:bg-slate-100 font-semibold px-4 py-2 rounded-xl">View Offer</Link>
                </div>
              </div>
            </section>
          </>
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
                      <FaRegCalendarAlt className="text-gray-400" /> {formatDateTime(t.scheduledAt)}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full h-fit">{t.mode}</span>
                </article>
              ))}
            </div>
            {labUpcomingLast && labUpcoming.length >= 5 && (
              <div className="mt-4">
                <button onClick={loadMoreUpcoming} type="button" className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">Load more</button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'reports' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900">Your Medical Reports</h2>
            <p className="mt-1 text-gray-600">Access and download your reports and prescriptions.</p>

            <div className="mt-6 space-y-6">
              {reportsData.length === 0 && (
                <p className="text-gray-600">No reports available yet.</p>
              )}
              {reportsData.map((r) => (
                <div key={r.id} className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <FaFileAlt className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{r.title}</h3>
                      <p className="text-sm text-gray-600">From: {r.from} - {formatDateTime(r.date)}</p>
                    </div>
                  </div>
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md inline-flex items-center gap-2">
                    <FaDownload /> Download
                  </a>
                </div>
              ))}
            </div>
            {reportsLast && reportsData.length >= 5 && (
              <div className="mt-4">
                <button onClick={loadMoreReports} type="button" className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800">Load more</button>
              </div>
            )}
          </section>
        )}

        {activeTab === 'cart' && (
          <section className="mt-6 bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2"><FaShoppingCart /> Your Cart</h2>
            <p className="mt-1 text-gray-600">Items you've added from pharmacies.</p>

            {cartItems.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <FaShoppingCart className="text-5xl text-gray-400" />
                <p className="mt-4 text-gray-600">Your cart is empty.</p>
                <Link to="/medicine-ordering" className="mt-2 text-blue-600 hover:underline">Start Shopping</Link>
              </div>
            ) : (
              <div className="mt-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-700">
                        <th className="py-2 pr-4">Item</th>
                        <th className="py-2 pr-4">Pharmacy</th>
                        <th className="py-2 pr-4">Qty</th>
                        <th className="py-2 pr-4">Price</th>
                        <th className="py-2 pr-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((it) => (
                        <tr key={it.id} className="border-t">
                          <td className="py-2 pr-4 text-gray-900 font-medium">{it.name}</td>
                          <td className="py-2 pr-4 text-gray-600">{it.pharmacy}</td>
                          <td className="py-2 pr-4">{it.qty}</td>
                          <td className="py-2 pr-4">₹{it.price}</td>
                          <td className="py-2 pr-4">₹{it.qty * it.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-gray-900">
                    Total: ₹{cartItems.reduce((sum, it) => sum + (Number(it.qty) * Number(it.price)), 0)}
                  </p>
                  <Link to="/cart" className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium">Go to Cart</Link>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Providers banner - keep lightweight */}
        {activeTab === 'overview' && (
          <section className="mt-10 bg-white rounded-2xl shadow-sm p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Medsta for Providers</h2>
            <p className="mt-2 text-gray-600">Join our network and grow with us.</p>
          </section>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

// Local component for summary cards
const SummaryCard = ({ title, primary, secondary, icon, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 border border-slate-100 flex flex-col justify-between ${className}`}>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
    <div className="mt-3">
      <div className="text-xl font-extrabold text-slate-900">{primary}</div>
      <div className="text-xs text-slate-500 mt-1">{secondary}</div>
    </div>
  </div>
);

