import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/Services/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { startPhoneLinking } from "@/Services/phone.service.js";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ensureAuthReady } from "@/Services/auth.helpers.js";
import { runFirebaseDiagnostics } from "@/Services/firebaseDiagnostics.js";

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;
    setError(null);

    // Basic password validations
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
          role: "patient",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 3: Create detailed profile
        await setDoc(doc(db, "patients", authUser.uid), {
          fullName: formData.fullName,
          dob: formData.dob || null,
          gender: formData.gender || null,
          bloodGroup: formData.bloodGroup || null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 4: Link phone if provided
        if (formData.phone) {
          try {
            // Start phone linking and open OTP modal
            const confirmation = await startPhoneLinking(formData.phone);
            setPendingConfirmation(confirmation);
            setOtpOpen(true);

            // Suspend here until OTP is handled
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

        // Diagnostics (non-blocking)
        runFirebaseDiagnostics().catch(() => {});
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
      <div className="max-w-2xl w-full px-6"> {/* UPDATED: max-w-md to max-w-2xl */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1"> {/* UPDATED: text-slate-900 to text-[#009cfb] */}
            Create a Patient Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Sign up to manage your health with Medsta. {/* UPDATED: HealTech to Medsta */}
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    bloodGroup: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              >
                <option value="">Select...</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
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

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
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

export default PatientSignup;