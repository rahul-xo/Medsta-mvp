import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "/src/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import AddressPicker from "/src/Components/common/AddressPicker.jsx";
import ToggleSwitch from "/src/Components/common/ToggleSwitch.jsx";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { startPhoneLinking } from "/src/utils/phoneAuth.js";

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    doctorFullName: "",
    clinicName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    consultationFee: "",
    medicalRegNumber: "",
    clinicAddress: "",
    clinicLat: null,
    clinicLng: null,
    videoConsultation: false,
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
      formData.doctorFullName &&
      formData.email &&
      formData.clinicAddress &&
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
          providerRole: "doctor",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 3: Create detailed profile
        await setDoc(doc(db, "providers_doctors", authUser.uid), {
          doctorFullName: formData.doctorFullName,
          clinicName: formData.clinicName || null,
          specialization: formData.specialization || null,
          experience: formData.experience || null,
          consultationFee: formData.consultationFee || null,
          medicalRegNumber: formData.medicalRegNumber || null,
          clinicAddress: formData.clinicAddress || null,
          clinicLat: formData.clinicLat || null,
          clinicLng: formData.clinicLng || null,
          videoConsultation: !!formData.videoConsultation,
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
            Create a Doctor Account
          </h1>
          <p className="text-sm text-slate-500 mb-6">
            Join HealTech and start accepting appointments.
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Doctor's Full Name
              </label>
              <input
                type="text"
                name="doctorFullName"
                value={formData.doctorFullName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    doctorFullName: e.target.value,
                  }))
                }
                placeholder="Dr. John Doe"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Clinic Name
              </label>
              <input
                type="text"
                name="clinicName"
                value={formData.clinicName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clinicName: e.target.value,
                  }))
                }
                placeholder="e.g. City Central Clinic"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
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

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  placeholder="e.g. Cardiologist"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  placeholder="e.g. 10"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Consultation Fee (INR)
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      consultationFee: e.target.value,
                    }))
                  }
                  placeholder="e.g. 500"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">
                  Medical Registration Number
                </label>
                <input
                  type="text"
                  name="medicalRegNumber"
                  value={formData.medicalRegNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      medicalRegNumber: e.target.value,
                    }))
                  }
                  placeholder="Certificate Number"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <AddressPicker
              label="Clinic Address"
              placeholder="Full clinic address"
              address={formData.clinicAddress}
              onChange={(addr) =>
                setFormData((prev) => ({ ...prev, clinicAddress: addr }))
              }
              lat={formData.clinicLat}
              lng={formData.clinicLng}
              onLocationChange={({ lat, lng }) =>
                setFormData((prev) => ({
                  ...prev,
                  clinicLat: lat,
                  clinicLng: lng,
                }))
              }
            />

            <ToggleSwitch
              checked={formData.videoConsultation}
              onChange={(v) =>
                setFormData((prev) => ({ ...prev, videoConsultation: v }))
              }
              label="Video Consultation"
              description="Are you available for video consultations?"
            />

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

export default DoctorSignup;
