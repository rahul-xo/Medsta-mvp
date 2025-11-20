import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "@/Services/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AddressPicker from "/src/Components/common/AddressPicker.jsx";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { startPhoneLinking } from "@/Services/phone.service.js";
import { ensureAuthReady } from "@/Services/auth.helpers.js";

const PharmacySignup = () => {
  const [formData, setFormData] = useState({
    pharmacyName: "",
    email: "",
    phone: "",
    pharmacyLicenseNumber: "",
    pharmacyAddress: "",
    pharmacyLat: null,
    pharmacyLng: null,
    pharmacyOpeningHours: "",
    password: "",
    confirmPassword: "",
    // new onboarding fields
    ownerName: "",
    gstCertificateFile: null,
    drugLicenseFiles: [],
    pharmacistRegistrationFile: null,
    inventoryFormat: "",
    deliveryCapability: "",
    storePhotos: [],
    sampleInvoiceFile: null,
    panNumber: "",
    bankAccount: { accountHolder: "", accountNumber: "", ifsc: "" },
    whatsappNumber: "",
    consents: { commissionAgreement: false, deliveryTerms: false, refundPolicy: false },
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
      formData.pharmacyName &&
      formData.email &&
      formData.pharmacyAddress &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError(null);

    if (!isValid()) {
      setError("Please fill in all required fields and ensure passwords match");
      return;
    }

    setIsLoading(true);
    let authUser = null;

    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      authUser = userCredential.user;
      await ensureAuthReady(auth, authUser.uid);

      try {
        // Step 2: Create user metadata document
        await setDoc(doc(db, "users", authUser.uid), {
          email: formData.email,
          role: "provider",
          providerRole: "pharmacy",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 3: Create detailed profile + upload docs
        const uploadFiles = async (files, folder) => {
          if (!files) return [];
          const arr = Array.isArray(files) ? files : [files];
          const urls = [];
          for (let i = 0; i < arr.length; i++) {
            const f = arr[i];
            if (!f) continue;
            const storageRef = ref(storage, `${'providers_pharmacies_docs'}/${authUser.uid}/${Date.now()}_${i}_${f.name}`);
            const snap = await uploadBytes(storageRef, f);
            const url = await getDownloadURL(snap.ref);
            urls.push(url);
          }
          return urls;
        };

        const docUploads = {};
        try {
          docUploads.gst = formData.gstCertificateFile ? (await uploadFiles(formData.gstCertificateFile, 'providers_pharmacies_docs'))[0] : null;
          docUploads.drugLicenses = formData.drugLicenseFiles && formData.drugLicenseFiles.length ? await uploadFiles(formData.drugLicenseFiles, 'providers_pharmacies_docs') : [];
          docUploads.pharmacistRegistration = formData.pharmacistRegistrationFile ? (await uploadFiles(formData.pharmacistRegistrationFile, 'providers_pharmacies_docs'))[0] : null;
          docUploads.storePhotos = formData.storePhotos && formData.storePhotos.length ? await uploadFiles(formData.storePhotos, 'providers_pharmacies_photos') : [];
          docUploads.sampleInvoice = formData.sampleInvoiceFile ? (await uploadFiles(formData.sampleInvoiceFile, 'providers_pharmacies_docs'))[0] : null;
        } catch (uErr) { console.warn('Upload error', uErr); }

        await setDoc(doc(db, "providers_pharmacies", authUser.uid), {
          pharmacyName: formData.pharmacyName,
          pharmacyLicenseNumber: formData.pharmacyLicenseNumber || null,
          pharmacyAddress: formData.pharmacyAddress || null,
          pharmacyLat: formData.pharmacyLat || null,
          pharmacyLng: formData.pharmacyLng || null,
          pharmacyOpeningHours: formData.pharmacyOpeningHours || null,
          ownerName: formData.ownerName || null,
          documents: {
            gst: docUploads.gst || null,
            drugLicenses: docUploads.drugLicenses || [],
            pharmacistRegistration: docUploads.pharmacistRegistration || null,
            storePhotos: docUploads.storePhotos || [],
            sampleInvoice: docUploads.sampleInvoice || null,
          },
          inventoryFormat: formData.inventoryFormat || null,
          deliveryCapability: formData.deliveryCapability || null,
          panNumber: formData.panNumber || null,
          bankAccount: formData.bankAccount || null,
          whatsappNumber: formData.whatsappNumber || null,
          consents: formData.consents || {},
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 4: Link phone if provided
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
            console.warn("Phone linking start failed:", e);
          }
        }

        // All operations succeeded
        setIsLoading(false);
        navigate("/login");
      } catch (firestoreError) {
        // If Firestore operations fail, delete the auth user to maintain consistency
        if (authUser) {
          try {
            await authUser.delete();
          } catch (deleteError) {
            console.error("Error cleaning up auth user:", deleteError);
          }
        }
        throw firestoreError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setError(error.message || "Failed to create account. Please try again.");
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
      setError(e.message || "Invalid OTP. Please try again.");
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  return (
    // ADDED pt-20, REMOVED bg-slate-50
    <main className="min-h-screen flex items-center justify-center py-12 pt-20">
       {/* UPDATED max-w-md to max-w-2xl */}
      <div className="max-w-2xl w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1">
            Create a Pharmacy Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Sell medicines and manage orders with Medsta.
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pharmacy Name
              </label>
              <input
                type="text"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pharmacyName: e.target.value,
                  }))
                }
                placeholder="City Pharmacy"
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="e.g. 9876543210"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Pharmacy License Number
              </label>
              <input
                type="text"
                name="pharmacyLicenseNumber"
                value={formData.pharmacyLicenseNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pharmacyLicenseNumber: e.target.value,
                  }))
                }
                placeholder="License Number"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            {/* Additional verification and operational inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Owner's Name</label>
                <input type="text" value={formData.ownerName} onChange={(e) => setFormData(p => ({ ...p, ownerName: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">GST Certificate (optional)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, gstCertificateFile: e.target.files[0] }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Drug License (Form 20/21) (multiple)</label>
                <input type="file" accept="image/*,.pdf" multiple onChange={(e) => setFormData(p => ({ ...p, drugLicenseFiles: Array.from(e.target.files || []) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pharmacist Registration (if applicable)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, pharmacistRegistrationFile: e.target.files[0] }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Inventory Format</label>
                <select value={formData.inventoryFormat} onChange={(e) => setFormData(p => ({ ...p, inventoryFormat: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md">
                  <option value="">Select</option>
                  <option value="excel">Excel</option>
                  <option value="api">API</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery capability</label>
                <input type="text" placeholder="e.g. own rider / medsta rider" value={formData.deliveryCapability} onChange={(e) => setFormData(p => ({ ...p, deliveryCapability: e.target.value }))} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Store photos (multiple)</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setFormData(p => ({ ...p, storePhotos: Array.from(e.target.files || []) }))} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sample invoice / bill (optional)</label>
                <input type="file" accept="image/*,.pdf" onChange={(e) => setFormData(p => ({ ...p, sampleInvoiceFile: e.target.files[0] }))} />
              </div>
            </div>

            <AddressPicker
              label="Address"
              placeholder="Full pharmacy address"
              address={formData.pharmacyAddress}
              onChange={(addr) =>
                setFormData((prev) => ({ ...prev, pharmacyAddress: addr }))
              }
              lat={formData.pharmacyLat}
              lng={formData.pharmacyLng}
              onLocationChange={({ lat, lng }) =>
                setFormData((prev) => ({
                  ...prev,
                  pharmacyLat: lat,
                  pharmacyLng: lng,
                }))
              }
            />

            <div>
              <label className="block text-sm font-medium mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                name="pharmacyOpeningHours"
                value={formData.pharmacyOpeningHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pharmacyOpeningHours: e.target.value,
                  }))
                }
                placeholder="e.g. 9 AM - 9 PM"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password (min. 6 characters)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            {(error || (!isValid() && submitAttempted)) && (
              <p className="text-sm text-red-600 mt-2">
                {error ||
                  "Please fill all required fields and ensure passwords match."}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || (!isValid() && submitAttempted)}
              className={`w-full ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : !isValid() && submitAttempted
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
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
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-slate-600 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
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

export default PharmacySignup;