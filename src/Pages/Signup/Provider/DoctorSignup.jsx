import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/Services/supabase.js";
import AddressPicker from "/src/Components/common/AddressPicker.jsx";
import ToggleSwitch from "/src/Components/common/ToggleSwitch.jsx";
import OtpModal from "/src/Components/common/OtpModal.jsx";
import { startPhoneLinking } from "@/Services/phone.service.js";
import { FaUserMd, FaClinicMedical, FaFileUpload, FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";

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
    clinicPhotosFiles: [],
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
      // Step 1: Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.doctorFullName,
            role: 'provider',
            provider_role: 'clinic'
          }
        }
      });

      if (authError) throw authError;
      authUser = authData.user;

      if (authUser) {
        // Step 2: Create user metadata document (if not handled by trigger)
        const { error: userError } = await supabase.from('users').insert({
          id: authUser.id,
          email: formData.email,
          role: "provider",
          provider_role: "clinic",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
        if (userError && userError.code !== '23505') { // 23505 is unique violation
           console.warn("User creation warning:", userError);
        }

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
            const filePath = `${folder}/${authUser.id}/${Date.now()}_${i}_${f.name}`;
            const { error: uploadError } = await supabase.storage
              .from('provider-docs') // Assuming a bucket named 'provider-docs'
              .upload(filePath, f);
            
            if (uploadError) {
              console.warn('Upload failed:', uploadError);
              continue;
            }

            const { data: { publicUrl } } = supabase.storage
              .from('provider-docs')
              .getPublicUrl(filePath);
            
            urls.push(publicUrl);
          }
          return urls;
        };

        // upload provider documents if provided
        const docUploads = {};
        try {
          docUploads.photoId = formData.photoIdFile ? (await uploadFiles(formData.photoIdFile, 'identity'))[0] : null;
          docUploads.degreeCertificates = formData.degreeFiles && formData.degreeFiles.length ? await uploadFiles(formData.degreeFiles, 'degrees') : [];
          docUploads.specializationProofs = formData.specializationProofFiles && formData.specializationProofFiles.length ? await uploadFiles(formData.specializationProofFiles, 'specialization') : [];
          docUploads.clinicLicense = formData.clinicLicenseFile ? (await uploadFiles(formData.clinicLicenseFile, 'licenses'))[0] : null;
          docUploads.prescriptionSample = formData.prescriptionSampleFile ? (await uploadFiles(formData.prescriptionSampleFile, 'samples'))[0] : null;
          docUploads.clinicPhotos = formData.clinicPhotosFiles && formData.clinicPhotosFiles.length ? await uploadFiles(formData.clinicPhotosFiles, 'clinic_photos') : [];
        } catch (uploadErr) {
          console.warn('Document upload failed, proceeding without docs:', uploadErr);
        }

        const { error: profileError } = await supabase.from('providers_clinics').insert({
          id: authUser.id, // Link by ID
          primary_contact_name: formData.doctorFullName,
          clinic_name: formData.clinicName || null,
          medical_reg_number: formData.medicalRegNumber || null,
          clinic_address: formData.clinicAddress || null,
          clinic_lat: formData.clinicLat || null,
          clinic_lng: formData.clinicLng || null,
          video_consultation: !!formData.videoConsultation,
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
          consents: formData.consents || {},
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (profileError) throw profileError;

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

  // Helper component for file inputs
  const FileUpload = ({ label, onChange, multiple = false, files }) => (
    <div className="form-group">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="file"
          id={label}
          className="hidden"
          onChange={onChange}
          multiple={multiple}
          accept="image/*,.pdf"
        />
        <label
          htmlFor={label}
          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-center">
            <FaFileUpload className="mx-auto h-6 w-6 text-slate-400 mb-1" />
            <span className="text-sm text-slate-600">
              {files && (multiple ? files.length > 0 : files) 
                ? (multiple ? `${files.length} file(s) selected` : files.name)
                : "Choose file(s)"}
            </span>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 py-12 pt-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Join <span className="text-blue-600">Medsta</span> as a Partner
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Register your clinic, manage appointments, and grow your practice with our comprehensive digital platform.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          {/* Progress/Header Bar could go here */}
          <div className="bg-blue-600 h-2 w-full"></div>

          <form onSubmit={handleSignUp} className="p-6 md:p-10 space-y-10">
            
            {/* Section 1: Clinic & Contact Info */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FaClinicMedical className="text-blue-500" /> Clinic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Contact Name</label>
                  <input
                    type="text"
                    value={formData.doctorFullName}
                    onChange={(e) => setFormData(p => ({ ...p, doctorFullName: e.target.value }))}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Clinic Name</label>
                  <input
                    type="text"
                    value={formData.clinicName}
                    onChange={(e) => setFormData(p => ({ ...p, clinicName: e.target.value }))}
                    placeholder="e.g. City Central Clinic"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medical Registration Number</label>
                  <input
                    type="text"
                    value={formData.medicalRegNumber}
                    onChange={(e) => setFormData(p => ({ ...p, medicalRegNumber: e.target.value }))}
                    placeholder="Registration / License Number"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <AddressPicker
                    label="Clinic Address"
                    placeholder="Search for your clinic location..."
                    address={formData.clinicAddress}
                    onChange={(addr) => setFormData(p => ({ ...p, clinicAddress: addr }))}
                    lat={formData.clinicLat}
                    lng={formData.clinicLng}
                    onLocationChange={({ lat, lng }) => setFormData(p => ({ ...p, clinicLat: lat, clinicLng: lng }))}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Doctors */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FaUserMd className="text-blue-500" /> Associated Doctors
              </h2>
              <div className="space-y-4">
                {formData.doctors.map((docItem, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative group transition-all hover:shadow-md">
                    <div className="absolute top-4 right-4">
                      {formData.doctors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, doctors: p.doctors.filter((_, i) => i !== idx) }))}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2"
                          title="Remove Doctor"
                        >
                          <FaTrash size={14} />
                        </button>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Doctor {idx + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="text"
                          value={docItem.name}
                          onChange={(e) => {
                            const doctors = [...formData.doctors];
                            doctors[idx].name = e.target.value;
                            setFormData(p => ({ ...p, doctors }));
                          }}
                          placeholder="Doctor Name"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={docItem.specialization}
                          onChange={(e) => {
                            const doctors = [...formData.doctors];
                            doctors[idx].specialization = e.target.value;
                            setFormData(p => ({ ...p, doctors }));
                          }}
                          placeholder="Specialization (e.g. Cardiologist)"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={docItem.experience}
                          onChange={(e) => {
                            const doctors = [...formData.doctors];
                            doctors[idx].experience = e.target.value;
                            setFormData(p => ({ ...p, doctors }));
                          }}
                          placeholder="Years of Experience"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={docItem.consultationFee}
                          onChange={(e) => {
                            const doctors = [...formData.doctors];
                            doctors[idx].consultationFee = e.target.value;
                            setFormData(p => ({ ...p, doctors }));
                          }}
                          placeholder="Consultation Fee (₹)"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, doctors: [...p.doctors, { name: "", specialization: "", experience: "", consultationFee: "" }] }))}
                  className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <FaPlus size={12} /> Add Another Doctor
                </button>
              </div>
            </section>

            {/* Section 3: Services & Verification */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FaCheckCircle className="text-blue-500" /> Verification & Services
              </h2>
              
              <div className="mb-8">
                <ToggleSwitch
                  checked={formData.videoConsultation}
                  onChange={(v) => setFormData(p => ({ ...p, videoConsultation: v }))}
                  label="Video Consultation Available"
                  description="Enable this if you offer remote video consultations to patients."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload 
                  label="Photo ID (Aadhaar / PAN)" 
                  files={formData.photoIdFile}
                  onChange={(e) => setFormData(p => ({ ...p, photoIdFile: e.target.files[0] }))} 
                />
                <FileUpload 
                  label="Degree Certificates" 
                  multiple 
                  files={formData.degreeFiles}
                  onChange={(e) => setFormData(p => ({ ...p, degreeFiles: Array.from(e.target.files || []) }))} 
                />
                <FileUpload 
                  label="Specialization Proof (Optional)" 
                  multiple 
                  files={formData.specializationProofFiles}
                  onChange={(e) => setFormData(p => ({ ...p, specializationProofFiles: Array.from(e.target.files || []) }))} 
                />
                <FileUpload 
                  label="Clinic License / Registration" 
                  files={formData.clinicLicenseFile}
                  onChange={(e) => setFormData(p => ({ ...p, clinicLicenseFile: e.target.files[0] }))} 
                />
                <FileUpload 
                  label="Prescription Sample (Optional)" 
                  files={formData.prescriptionSampleFile}
                  onChange={(e) => setFormData(p => ({ ...p, prescriptionSampleFile: e.target.files[0] }))} 
                />

              </div>
            </section>

            {/* Section 4: Clinic Photos (Optional) */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FaCamera className="text-blue-500" /> Clinic Photos
              </h2>
              <div className="mb-8">
                <p className="text-sm text-slate-500 mb-4">Upload photos of your clinic to help patients identify your facility (Optional).</p>
                <FileUpload 
                  label="Clinic Photos" 
                  multiple 
                  files={formData.clinicPhotosFiles}
                  onChange={(e) => setFormData(p => ({ ...p, clinicPhotosFiles: Array.from(e.target.files || []) }))} 
                />
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    checked={formData.consents.listOnMedsta} 
                    onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, listOnMedsta: e.target.checked } }))} 
                  />
                  <span className="text-sm text-slate-600">I consent to be listed on Medsta and allow patients to book appointments.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    checked={formData.consents.pricingTerms} 
                    onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, pricingTerms: e.target.checked } }))} 
                  />
                  <span className="text-sm text-slate-600">I agree to the pricing and booking terms & conditions.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    checked={formData.consents.dataHandling} 
                    onChange={(e) => setFormData(p => ({ ...p, consents: { ...p.consents, dataHandling: e.target.checked } }))} 
                  />
                  <span className="text-sm text-slate-600">I consent to the data handling policy.</span>
                </label>
              </div>
            </section>

            {/* Section 5: Security */}
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FaLock className="text-blue-500" /> Account Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all outline-none"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Error & Submit */}
            <div className="pt-6 border-t border-slate-100">
              {(error || (!isValid() && submitAttempted)) && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center gap-2">
                  <span className="font-bold">Error:</span> {error || "Please fill all required fields and ensure passwords match."}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:-translate-y-0.5 ${
                  isLoading 
                    ? "bg-slate-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-200"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  "Create Clinic Account"
                )}
              </button>
              
              <p className="text-slate-500 mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </form>
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

// Missing icon imports fix
import { FaLock, FaCamera } from "react-icons/fa";

export default DoctorSignup;
