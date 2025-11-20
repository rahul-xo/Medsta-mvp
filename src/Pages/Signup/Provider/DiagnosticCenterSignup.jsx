import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, storage } from '@/Services/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AddressPicker from '/src/Components/common/AddressPicker.jsx';
import ToggleSwitch from '/src/Components/common/ToggleSwitch.jsx';
import OtpModal from '/src/Components/common/OtpModal.jsx';
import { startPhoneLinking } from '@/Services/phone.service.js';
import { ensureAuthReady } from '@/Services/auth.helpers.js';

const DiagnosticCenterSignup = () => {
  const [formData, setFormData] = useState({
    diagnosticCenterName: '',
    email: '',
    phone: '',
    diagnosticLicenseNumber: '',
    diagnosticAddress: '',
    diagnosticLat: null,
    diagnosticLng: null,
    diagnosticOpeningHours: '',
    atHomeSampleCollection: false,
    reportDelivery: false,
    password: '',
    confirmPassword: '',
    // new onboarding fields
    nablCertificateFile: null,
    labRegistrationFile: null,
    pathologistCredentialsFiles: [],
    testMenu: '',
    sampleReportFile: null,
    labPhotos: [],
    panNumber: '',
    bankAccount: { accountHolder: '', accountNumber: '', ifsc: '' },
    whatsappNumber: '',
    consents: { bookingFlow: false, refundTerms: false, dataPrivacy: false },
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
      formData.diagnosticCenterName &&
      formData.email &&
      formData.diagnosticAddress &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);
    if (!isValid()) return;

    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await ensureAuthReady(auth, user.uid);

      // users metadata
      await setDoc(doc(db, 'users', user.uid), {
        email: formData.email,
        role: 'provider',
        providerRole: 'diagnostic_center',
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
          const storageRef = ref(storage, `${folder}/${user.uid}/${Date.now()}_${i}_${f.name}`);
          const snap = await uploadBytes(storageRef, f);
          const url = await getDownloadURL(snap.ref);
          urls.push(url);
        }
        return urls;
      };

      const docUploads = {};
      try {
        docUploads.nabl = formData.nablCertificateFile ? (await uploadFiles(formData.nablCertificateFile, 'providers_diagnostic_docs'))[0] : null;
        docUploads.registration = formData.labRegistrationFile ? (await uploadFiles(formData.labRegistrationFile, 'providers_diagnostic_docs'))[0] : null;
        docUploads.pathologist = formData.pathologistCredentialsFiles && formData.pathologistCredentialsFiles.length ? await uploadFiles(formData.pathologistCredentialsFiles, 'providers_diagnostic_docs') : [];
        docUploads.sampleReport = formData.sampleReportFile ? (await uploadFiles(formData.sampleReportFile, 'providers_diagnostic_docs'))[0] : null;
        docUploads.labPhotos = formData.labPhotos && formData.labPhotos.length ? await uploadFiles(formData.labPhotos, 'providers_diagnostic_photos') : [];
      } catch (uErr) { console.warn('Upload error', uErr); }

      // profile doc
      await setDoc(doc(db, 'providers_diagnostic_centers', user.uid), {
        diagnosticCenterName: formData.diagnosticCenterName,
        diagnosticLicenseNumber: formData.diagnosticLicenseNumber || null,
        diagnosticAddress: formData.diagnosticAddress || null,
        diagnosticLat: formData.diagnosticLat || null,
        diagnosticLng: formData.diagnosticLng || null,
        diagnosticOpeningHours: formData.diagnosticOpeningHours || null,
        atHomeSampleCollection: !!formData.atHomeSampleCollection,
        reportDelivery: !!formData.reportDelivery,
        documents: {
          nabl: docUploads.nabl || null,
          registration: docUploads.registration || null,
          pathologistCredentials: docUploads.pathologist || [],
          sampleReport: docUploads.sampleReport || null,
          labPhotos: docUploads.labPhotos || [],
        },
        testMenu: formData.testMenu || null,
        panNumber: formData.panNumber || null,
        bankAccount: formData.bankAccount || null,
        whatsappNumber: formData.whatsappNumber || null,
        consents: formData.consents || {},
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
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.message || 'Sign up failed');
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (code) => {
    if (!pendingConfirmation) {
      setOtpOpen(false);
      return;
    }
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
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-4-md px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1"> {/* UPDATED COLOR HERE */}
            Create a Diagnostic Center Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">Serve patients with lab services through Medsta.</p> {/* UPDATED: HealTech to Medsta */}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Diagnostic Center Name</label>
              <input
                type="text"
                name="diagnosticCenterName"
                value={formData.diagnosticCenterName}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticCenterName: e.target.value }))}
                placeholder="City Labs"
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

            <div>
              <label className="block text-sm font-medium mb-2">Center License Number</label>
              <input
                type="text"
                name="diagnosticLicenseNumber"
                value={formData.diagnosticLicenseNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticLicenseNumber: e.target.value }))}
                placeholder="License Number"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            {/* Additional verification inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">NABL Certificate (if available)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, nablCertificateFile: e.target.files[0] }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Lab Registration Document</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, labRegistrationFile: e.target.files[0] }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pathologist Credentials (multiple)</label>
                <input type="file" accept="image/*,.pdf" multiple onChange={(e) => setFormData(p => ({ ...p, pathologistCredentialsFiles: Array.from(e.target.files || []) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sample report format</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, sampleReportFile: e.target.files[0] }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lab photos (multiple)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setFormData(p => ({ ...p, labPhotos: Array.from(e.target.files || []) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Test menu (brief)</label>
                <input type="text" value={formData.testMenu} onChange={(e) => setFormData(p => ({ ...p, testMenu: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>
            </div>

            <AddressPicker
              label="Address"
              placeholder="Full diagnostic address"
              address={formData.diagnosticAddress}
              onChange={(addr) => setFormData(prev => ({ ...prev, diagnosticAddress: addr }))}
              lat={formData.diagnosticLat}
              lng={formData.diagnosticLng}
              onLocationChange={({ lat, lng }) => setFormData(prev => ({ ...prev, diagnosticLat: lat, diagnosticLng: lng }))}
            />

            <div>
              <label className="block text-sm font-medium mb-2">Opening Hours</label>
              <input
                type="text"
                name="diagnosticOpeningHours"
                value={formData.diagnosticOpeningHours}
                onChange={(e) => setFormData(prev => ({ ...prev, diagnosticOpeningHours: e.target.value }))}
                placeholder="e.g. 9 AM - 9 PM"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                checked={formData.atHomeSampleCollection}
                onChange={(v) => setFormData(prev => ({ ...prev, atHomeSampleCollection: v }))}
                label="At-Home Sample Collection"
                description="Do you offer sample collection from home?"
              />

              <ToggleSwitch
                checked={formData.reportDelivery}
                onChange={(v) => setFormData(prev => ({ ...prev, reportDelivery: v }))}
                label="Report Delivery"
                description="Do you offer home delivery of reports?"
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
              <p className="text-sm text-red-600 mt-2">{error || 'Please fill all required fields and ensure passwords match.'}</p>
            )}
            <button
              type="submit"
              disabled={isLoading || !isValid()}
              className={`w-full text-white px-4 py-2 rounded-md ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : isValid()
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
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

export default DiagnosticCenterSignup;