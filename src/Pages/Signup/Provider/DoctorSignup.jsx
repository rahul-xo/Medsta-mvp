import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "@/Services/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AddressPicker from "/src/Components/common/AddressPicker.jsx";
import ToggleSwitch from "/src/Components/common/ToggleSwitch.jsx";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { startPhoneLinking } from "@/Services/phone.service.js";
import { ensureAuthReady } from "@/Services/auth.helpers.js";

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    doctorFullName: "",
    clinicName: "",
    email: "",
    phone: "",
    medicalRegNumber: "",
    clinicAddress: "",
    clinicLat: null,
    clinicLng: null,
    videoConsultation: false,
    doctors: [
      { name: "", specialization: "", experience: "", consultationFee: "" },
    ],
    password: "",
    confirmPassword: "",
    // New provider onboarding fields
    photoIdFile: null,
    degreeFiles: [],
    specializationProofFiles: [],
    clinicLicenseFile: null,
    prescriptionSampleFile: null,
    clinicPhotosFiles: [],
    panNumber: "",
    bankAccount: { accountHolder: "", accountNumber: "", ifsc: "" },
    whatsappNumber: "",
    consents: { listOnMedsta: false, pricingTerms: false, dataHandling: false },
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
      await ensureAuthReady(auth, authUser.uid);

      try {
        // Step 2: Create user metadata document
        await setDoc(doc(db, "users", authUser.uid), {
          email: formData.email,
          role: "provider",
          providerRole: "clinic",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Step 3: Create detailed clinic profile in new collection
        const doctorsArr = (formData.doctors || [])
          .filter((d) => d.name || d.specialization)
          .map((d, idx) => ({
            id: `${Date.now()}-${idx}`,
            fullName: d.name || "",
            specialization: d.specialization || "",
            yearsExperience: Number(d.experience || 0),
            consultationFee: Number(d.consultationFee || 0),
          }));

        const specializations = Array.from(
          new Set(doctorsArr.map((d) => d.specialization).filter(Boolean))
        );

        // helper to upload files and return URLs
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

        // upload provider documents if provided
        const docUploads = {};
        try {
          docUploads.photoId = formData.photoIdFile ? (await uploadFiles(formData.photoIdFile, 'providers_docs'))[0] : null;
          docUploads.degreeCertificates = formData.degreeFiles && formData.degreeFiles.length ? await uploadFiles(formData.degreeFiles, 'providers_docs') : [];
          docUploads.specializationProofs = formData.specializationProofFiles && formData.specializationProofFiles.length ? await uploadFiles(formData.specializationProofFiles, 'providers_docs') : [];
          docUploads.clinicLicense = formData.clinicLicenseFile ? (await uploadFiles(formData.clinicLicenseFile, 'providers_docs'))[0] : null;
          docUploads.prescriptionSample = formData.prescriptionSampleFile ? (await uploadFiles(formData.prescriptionSampleFile, 'providers_docs'))[0] : null;
          docUploads.clinicPhotos = formData.clinicPhotosFiles && formData.clinicPhotosFiles.length ? await uploadFiles(formData.clinicPhotosFiles, 'providers_photos') : [];
        } catch (uploadErr) {
          console.warn('Document upload failed, proceeding without docs:', uploadErr);
        }

        await setDoc(doc(db, "providers_clinics", authUser.uid), {
          primaryContactName: formData.doctorFullName,
          clinicName: formData.clinicName || null,
          medicalRegNumber: formData.medicalRegNumber || null,
          clinicAddress: formData.clinicAddress || null,
          clinicLat: formData.clinicLat || null,
          clinicLng: formData.clinicLng || null,
          videoConsultation: !!formData.videoConsultation,
          doctors: doctorsArr,
          specializations,
          // New fields
          documents: {
            photoId: docUploads.photoId || null,
            degreeCertificates: docUploads.degreeCertificates || [],
            specializationProofs: docUploads.specializationProofs || [],
            clinicLicense: docUploads.clinicLicense || null,
            prescriptionSample: docUploads.prescriptionSample || null,
            clinicPhotos: docUploads.clinicPhotos || [],
          },
          panNumber: formData.panNumber || null,
          bankAccount: formData.bankAccount || null,
          whatsappNumber: formData.whatsappNumber || null,
          consents: formData.consents || {},
          status: "pending",
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
          <h1 className="text-3xl font-bold text-[#009cfb] mb-1">Create a Clinic Account</h1>
          <p className="text-sm text-slate-500 mb-6">Register your clinic and optionally add multiple doctors now or later.</p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Contact Name</label>
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
                placeholder="e.g. Dr. John Doe or Clinic Admin"
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

            {/* Doctors list for this clinic */}
            <div className="mt-2">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Doctors</h2>
              <p className="text-sm text-slate-500 mb-3">Add one or more doctors associated with this clinic.</p>
              {formData.doctors.map((docItem, idx) => (
                <div key={idx} className="mb-4 border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-700">Doctor {idx + 1}</h3>
                    {formData.doctors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, doctors: p.doctors.filter((_, i) => i !== idx) }))}
                        className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200 text-sm"
                        aria-label="Remove doctor"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Doctor name</label>
                      <input
                        type="text"
                        value={docItem.name}
                        onChange={(e) => {
                          const doctors = [...formData.doctors];
                          doctors[idx] = { ...doctors[idx], name: e.target.value };
                          setFormData((p) => ({ ...p, doctors }));
                        }}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Specialization</label>
                      <input
                        type="text"
                        value={docItem.specialization}
                        onChange={(e) => {
                          const doctors = [...formData.doctors];
                          doctors[idx] = { ...doctors[idx], specialization: e.target.value };
                          setFormData((p) => ({ ...p, doctors }));
                        }}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Years of Experience</label>
                      <input
                        type="number"
                        value={docItem.experience}
                        onChange={(e) => {
                          const doctors = [...formData.doctors];
                          doctors[idx] = { ...doctors[idx], experience: e.target.value };
                          setFormData((p) => ({ ...p, doctors }));
                        }}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Fee (INR)</label>
                      <input
                        type="number"
                        value={docItem.consultationFee}
                        onChange={(e) => {
                          const doctors = [...formData.doctors];
                          doctors[idx] = { ...doctors[idx], consultationFee: e.target.value };
                          setFormData((p) => ({ ...p, doctors }));
                        }}
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData((p) => ({ ...p, doctors: [...p.doctors, { name: "", specialization: "", experience: "", consultationFee: "" }] }))}
                className="mt-1 px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                + Add another doctor
              </button>
            </div>

            {/* Clinic registration number (optional) */}
            <div>
              <label className="block text-sm font-medium mb-2">Medical Registration Number</label>
              <input
                type="text"
                name="medicalRegNumber"
                value={formData.medicalRegNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, medicalRegNumber: e.target.value }))}
                placeholder="Clinic registration number (optional)"
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
              />
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

            {/* Documents & verification inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Photo ID (Aadhaar / PAN)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData((p) => ({ ...p, photoIdFile: e.target.files[0] }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Degree certificates (multiple)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => setFormData((p) => ({ ...p, degreeFiles: Array.from(e.target.files || []) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Specialization proof (optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(e) => setFormData((p) => ({ ...p, specializationProofFiles: Array.from(e.target.files || []) }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Clinic License / Registration</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData((p) => ({ ...p, clinicLicenseFile: e.target.files[0] }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Prescription sample (optional)</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFormData((p) => ({ ...p, prescriptionSampleFile: e.target.files[0] }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Clinic photos (multiple)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFormData((p) => ({ ...p, clinicPhotosFiles: Array.from(e.target.files || []) }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, panNumber: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, whatsappNumber: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bank A/C (IFSC)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.bankAccount.accountHolder}
                    onChange={(e) => setFormData((p) => ({ ...p, bankAccount: { ...p.bankAccount, accountHolder: e.target.value } }))}
                    placeholder="Holder"
                    className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.bankAccount.accountNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, bankAccount: { ...p.bankAccount, accountNumber: e.target.value } }))}
                    placeholder="Account No"
                    className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.bankAccount.ifsc}
                    onChange={(e) => setFormData((p) => ({ ...p, bankAccount: { ...p.bankAccount, ifsc: e.target.value } }))}
                    placeholder="IFSC"
                    className="w-1/3 px-3 py-2 bg-slate-100 border border-slate-200 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" checked={formData.consents.listOnMedsta} onChange={(e) => setFormData((p) => ({ ...p, consents: { ...p.consents, listOnMedsta: e.target.checked } }))} />
                <span className="text-sm">I consent to be listed on Medsta</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="checkbox" className="mr-2" checked={formData.consents.pricingTerms} onChange={(e) => setFormData((p) => ({ ...p, consents: { ...p.consents, pricingTerms: e.target.checked } }))} />
                <span className="text-sm">Agree to pricing & booking terms</span>
              </label>
              <label className="inline-flex items-center ml-4">
                <input type="checkbox" className="mr-2" checked={formData.consents.dataHandling} onChange={(e) => setFormData((p) => ({ ...p, consents: { ...p.consents, dataHandling: e.target.checked } }))} />
                <span className="text-sm">Consent to data handling policy</span>
              </label>
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

export default DoctorSignup;