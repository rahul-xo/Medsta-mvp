import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "/src/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import AddressPicker from "/src/Components/common/AddressPicker.jsx";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { startPhoneLinking } from "/src/utils/phoneAuth.js";

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

      try {
        // Step 2: Create user metadata document
        await setDoc(doc(db, "users", authUser.uid), {
          email: formData.email,
          role: "provider",
          providerRole: "pharmacy",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 3: Create detailed profile
        await setDoc(doc(db, "providers_pharmacies", authUser.uid), {
          pharmacyName: formData.pharmacyName,
          pharmacyLicenseNumber: formData.pharmacyLicenseNumber || null,
          pharmacyAddress: formData.pharmacyAddress || null,
          pharmacyLat: formData.pharmacyLat || null,
          pharmacyLng: formData.pharmacyLng || null,
          pharmacyOpeningHours: formData.pharmacyOpeningHours || null,
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
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Create a Pharmacy Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Sell medicines and manage orders with HealTech.
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
