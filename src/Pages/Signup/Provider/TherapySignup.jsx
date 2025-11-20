import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '@/Services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AddressPicker from '/src/Components/common/AddressPicker.jsx';
import OtpModal from '/src/Components/common/OtpModal.jsx';
import { startPhoneLinking } from '@/Services/phone.service.js';
import { ensureAuthReady } from '@/Services/auth.helpers.js';

const TherapySignup = () => {
  const [formData, setFormData] = useState({
    therapistFullName: '',
    therapyType: '',
    centerName: '',
    email: '',
    phone: '',
    address: '',
    lat: null,
    lng: null,
    experience: '',
    sessionFee: '',
    password: '',
    confirmPassword: '',
    // new onboarding fields
    degreeFiles: [],
    registrationFile: null,
    experienceCertFiles: [],
    servicesOffered: '',
    providerPhotos: [],
    panNumber: '',
    bankAccount: { accountHolder: '', accountNumber: '', ifsc: '' },
    whatsappNumber: '',
    consents: { booking: false, cancellation: false, feedbackPolicy: false },
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
      formData.therapistFullName &&
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
          providerRole: 'therapy',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // upload helper
        const uploadFiles = async (files, folder) => {
          if (!files) return [];
          const arr = Array.isArray(files) ? files : [files];
          const urls = [];
          for (let i = 0; i < arr.length; i++) {
            const f = arr[i];
            if (!f) continue;
            const storageRef = ref(storage, `${folder}/${authUser.uid}/${Date.now()}_${i}_${f.name}`);
            const snap = await uploadBytes(storageRef, f);
            const url = await getDownloadURL(snap.ref);
            urls.push(url);
          }
          return urls;
        };

        const docUploads = {};
        try {
          docUploads.degrees = formData.degreeFiles && formData.degreeFiles.length ? await uploadFiles(formData.degreeFiles, 'providers_therapies_docs') : [];
          docUploads.registration = formData.registrationFile ? (await uploadFiles(formData.registrationFile, 'providers_therapies_docs'))[0] : null;
          docUploads.experienceCerts = formData.experienceCertFiles && formData.experienceCertFiles.length ? await uploadFiles(formData.experienceCertFiles, 'providers_therapies_docs') : [];
          docUploads.photos = formData.providerPhotos && formData.providerPhotos.length ? await uploadFiles(formData.providerPhotos, 'providers_therapies_photos') : [];
        } catch (uErr) { console.warn('Upload error', uErr); }

        await setDoc(doc(db, 'providers_therapies', authUser.uid), {
          therapistFullName: formData.therapistFullName,
          therapyType: formData.therapyType || null,
          centerName: formData.centerName || null,
          address: formData.address || null,
          lat: formData.lat || null,
          lng: formData.lng || null,
          email: formData.email || null,
          phone: formData.phone || null,
          yearsExperience: Number(formData.experience || 0),
          sessionFee: Number(formData.sessionFee || 0),
          servicesOffered: formData.servicesOffered || null,
          documents: {
            degreeCertificates: docUploads.degrees || [],
            registration: docUploads.registration || null,
            experienceCertificates: docUploads.experienceCerts || [],
            photos: docUploads.photos || [],
          },
          panNumber: formData.panNumber || null,
          bankAccount: formData.bankAccount || null,
          whatsappNumber: formData.whatsappNumber || null,
          consents: formData.consents || {},
          modes: { atCenter: true },
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
      console.error('Therapy signup failed:', err);
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
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1">Create a Therapy Provider Account</h1>
          <p className="text-sm text-slate-500 mb-6">Offer therapy and wellness sessions through Medsta.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Therapist's Full Name</label>
              <input
                type="text"
                value={formData.therapistFullName}
                onChange={(e) => setFormData((p) => ({ ...p, therapistFullName: e.target.value }))}
                placeholder="Dr. Jane Doe"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Therapy Type</label>
                <input
                  type="text"
                  value={formData.therapyType}
                  onChange={(e) => setFormData((p) => ({ ...p, therapyType: e.target.value }))}
                  placeholder="e.g. Physiotherapy, Mental Health"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Center/Clinic Name</label>
                <input
                  type="text"
                  value={formData.centerName}
                  onChange={(e) => setFormData((p) => ({ ...p, centerName: e.target.value }))}
                  placeholder="Wellness Care Center"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Experience (years)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                  placeholder="e.g. 5"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Session Fee (INR)</label>
                <input
                  type="number"
                  value={formData.sessionFee}
                  onChange={(e) => setFormData((p) => ({ ...p, sessionFee: e.target.value }))}
                  placeholder="e.g. 800"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <div>
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

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <AddressPicker
              label="Address"
              placeholder="Full clinic address"
              address={formData.address}
              onChange={(addr) => setFormData((p) => ({ ...p, address: addr }))}
              lat={formData.lat}
              lng={formData.lng}
              onLocationChange={({ lat, lng }) => setFormData((p) => ({ ...p, lat, lng }))}
            />

            {/* Documents & operational inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Degree / Diploma (multiple)</label>
                <input type="file" accept="image/*,.pdf" multiple onChange={(e) => setFormData(p => ({ ...p, degreeFiles: Array.from(e.target.files || []) }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Registration / License (if any)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, registrationFile: e.target.files[0] }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience certificates (optional)</label>
                <input type="file" accept="image/*,.pdf" multiple onChange={(e) => setFormData(p => ({ ...p, experienceCertFiles: Array.from(e.target.files || []) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Services offered (brief)</label>
                <input type="text" value={formData.servicesOffered} onChange={(e) => setFormData(p => ({ ...p, servicesOffered: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Provider photos (multiple)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setFormData(p => ({ ...p, providerPhotos: Array.from(e.target.files || []) }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <div>
                <label className="block text-sm font-medium mb-2">PAN Number</label>
                <input type="text" value={formData.panNumber} onChange={(e) => setFormData(p => ({ ...p, panNumber: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                <input type="tel" value={formData.whatsappNumber} onChange={(e) => setFormData(p => ({ ...p, whatsappNumber: e.target.value }))} placeholder="e.g. 9876543210" className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bank A/C (IFSC)</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.bankAccount.accountHolder} onChange={(e) => setFormData(p => ({ ...p, bankAccount: { ...p.bankAccount, accountHolder: e.target.value } }))} placeholder="Holder" className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md" />
                  <input type="text" value={formData.bankAccount.accountNumber} onChange={(e) => setFormData(p => ({ ...p, bankAccount: { ...p.bankAccount, accountNumber: e.target.value } }))} placeholder="Account No" className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md" />
                  <input type="text" value={formData.bankAccount.ifsc} onChange={(e) => setFormData(p => ({ ...p, bankAccount: { ...p.bankAccount, ifsc: e.target.value } }))} placeholder="IFSC" className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md" />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={formData.consents.booking} onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, booking: e.target.checked } }))} />
                <span className="text-sm">Agree to booking policies</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="checkbox" className="mr-2" checked={formData.consents.cancellation} onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, cancellation: e.target.checked } }))} />
                <span className="text-sm">Agree to cancellation & refund rules</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="checkbox" className="mr-2" checked={formData.consents.feedbackPolicy} onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, feedbackPolicy: e.target.checked } }))} />
                <span className="text-sm">Consent to feedback & data policies</span>
              </label>
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

export default TherapySignup;
