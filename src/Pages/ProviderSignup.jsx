import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '/src/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// Map support
import AddressPicker from '../Components/common/AddressPicker.jsx';
import ToggleSwitch from '../Components/common/ToggleSwitch.jsx';
// import 'leaflet/dist/leaflet.css';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icons for Vite builds
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

const ProviderSignup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    providerRole: '',
    doctorFullName: '',
    clinicName: '',
    phone: '',
    specialization: '',
    experience: '',
    consultationFee: '',
    medicalRegNumber: '',
    clinicAddress: '',
    videoConsultation: false,
    clinicLat: null,
    clinicLng: null,
    // Diagnostic Center fields
    diagnosticCenterName: '',
    diagnosticLicenseNumber: '',
    diagnosticAddress: '',
    diagnosticOpeningHours: '',
    diagnosticLat: null,
    diagnosticLng: null,
    atHomeSampleCollection: false,
    reportDelivery: false,
    // Pharmacy fields
    pharmacyName: '',
    pharmacyLicenseNumber: '',
    pharmacyAddress: '',
    pharmacyOpeningHours: '',
    pharmacyLat: null,
    pharmacyLng: null,
    // Delivery Agent fields
    deliveryFullName: '',
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const isValid = () => {
    const role = formData.providerRole;
    if (!role) return false;
    if (formData.password.length < 6 || formData.password !== formData.confirmPassword) return false;
    if (role === 'doctor') {
      return !!(formData.doctorFullName && formData.email && formData.clinicAddress);
    }
    if (role === 'diagnostic_center') {
      return !!(formData.diagnosticCenterName && formData.email && formData.diagnosticAddress);
    }
    if (role === 'pharmacy') {
      return !!(formData.pharmacyName && formData.email && formData.pharmacyAddress);
    }
    if (role === 'delivery_agent') {
      return !!(formData.deliveryFullName && formData.email);
    }
    return true;
  };
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid()) return;
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userDoc = {
        fullName: formData.fullName,
        email: formData.email,
        role: 'provider',
        providerRole: formData.providerRole || null,
      };

      if (formData.providerRole === 'doctor') {
        userDoc.doctorFullName = formData.doctorFullName || null;
        userDoc.clinicName = formData.clinicName || null;
        userDoc.phone = formData.phone || null;
        userDoc.specialization = formData.specialization || null;
        userDoc.experience = formData.experience || null;
        userDoc.consultationFee = formData.consultationFee || null;
        userDoc.medicalRegNumber = formData.medicalRegNumber || null;
        userDoc.clinicAddress = formData.clinicAddress || null;
        userDoc.videoConsultation = !!formData.videoConsultation;
        userDoc.clinicLat = formData.clinicLat || null;
        userDoc.clinicLng = formData.clinicLng || null;
      }

      if (formData.providerRole === 'diagnostic_center') {
        userDoc.diagnosticCenterName = formData.diagnosticCenterName || null;
        userDoc.phone = formData.phone || null;
        userDoc.diagnosticLicenseNumber = formData.diagnosticLicenseNumber || null;
        userDoc.diagnosticAddress = formData.diagnosticAddress || null;
        userDoc.diagnosticOpeningHours = formData.diagnosticOpeningHours || null;
        userDoc.atHomeSampleCollection = !!formData.atHomeSampleCollection;
        userDoc.reportDelivery = !!formData.reportDelivery;
        userDoc.diagnosticLat = formData.diagnosticLat || null;
        userDoc.diagnosticLng = formData.diagnosticLng || null;
      }

      if (formData.providerRole === 'pharmacy') {
        userDoc.pharmacyName = formData.pharmacyName || null;
        userDoc.phone = formData.phone || null;
        userDoc.pharmacyLicenseNumber = formData.pharmacyLicenseNumber || null;
        userDoc.pharmacyAddress = formData.pharmacyAddress || null;
        userDoc.pharmacyOpeningHours = formData.pharmacyOpeningHours || null;
        userDoc.pharmacyLat = formData.pharmacyLat || null;
        userDoc.pharmacyLng = formData.pharmacyLng || null;
      }

      await setDoc(doc(db, 'users', user.uid), userDoc);
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      alert(`Sign up failed: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="max-w-md w-full px-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Create a Provider Account</h1>
          <p className="text-sm text-slate-500 mb-6">Join HealTech as a Doctor, Lab, Pharmacy, or Delivery Agent.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">I am a...</label>
              <select
                name="providerRole"
                value={formData.providerRole}
                onChange={(e) => setFormData(prev => ({ ...prev, providerRole: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                required
              >
                <option value="">Select your provider role</option>
                <option value="doctor">Doctor</option>
                <option value="diagnostic_center">Diagnostic Center</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="delivery_agent">Delivery Agent</option>
              </select>
            </div>

            {formData.providerRole && (
              <form onSubmit={handleSignUp} className="space-y-4">
                {formData.providerRole === 'doctor' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Doctor's Full Name</label>
                      <input
                        type="text"
                        name="doctorFullName"
                        value={formData.doctorFullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctorFullName: e.target.value }))}
                        placeholder="Dr. John Doe / City Labs"
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Clinic Name</label>
                      <input
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={(e) => setFormData(prev => ({ ...prev, clinicName: e.target.value }))}
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

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Specialization</label>
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                          placeholder="e.g. Cardiologist"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Experience (years)</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                          placeholder="e.g. 10"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Consultation Fee (INR)</label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={formData.consultationFee}
                          onChange={(e) => setFormData(prev => ({ ...prev, consultationFee: e.target.value }))}
                          placeholder="e.g. 500"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Medical Registration Number</label>
                        <input
                          type="text"
                          name="medicalRegNumber"
                          value={formData.medicalRegNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, medicalRegNumber: e.target.value }))}
                          placeholder="Certificate Number"
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>

                    <AddressPicker
                      label="Clinic Address"
                      placeholder="Full clinic address"
                      address={formData.clinicAddress}
                      onChange={(addr) => setFormData(prev => ({ ...prev, clinicAddress: addr }))}
                      lat={formData.clinicLat}
                      lng={formData.clinicLng}
                      onLocationChange={({ lat, lng }) => setFormData(prev => ({ ...prev, clinicLat: lat, clinicLng: lng }))}
                    />

                    <ToggleSwitch
                      checked={formData.videoConsultation}
                      onChange={(v) => setFormData(prev => ({ ...prev, videoConsultation: v }))}
                      label="Video Consultation"
                      description="Are you available for video consultations?"
                    />
                  </>
                )}

                {formData.providerRole === 'diagnostic_center' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Diagnostic Center Name</label>
                      <input
                        type="text"
                        name="diagnosticCenterName"
                        value={formData.diagnosticCenterName}
                        onChange={(e) => setFormData(prev => ({ ...prev, diagnosticCenterName: e.target.value }))}
                        placeholder="Dr. John Doe / City Labs"
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
                  </>
                )}

                {formData.providerRole === 'pharmacy' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pharmacy Name</label>
                      <input
                        type="text"
                        name="pharmacyName"
                        value={formData.pharmacyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, pharmacyName: e.target.value }))}
                        placeholder="Dr. John Doe / City Labs"
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
                      <label className="block text-sm font-medium mb-2">Pharmacy License Number</label>
                      <input
                        type="text"
                        name="pharmacyLicenseNumber"
                        value={formData.pharmacyLicenseNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, pharmacyLicenseNumber: e.target.value }))}
                        placeholder="License Number"
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>
                    <AddressPicker
                      label="Address"
                      placeholder="Full pharmacy address"
                      address={formData.pharmacyAddress}
                      onChange={(addr) => setFormData(prev => ({ ...prev, pharmacyAddress: addr }))}
                      lat={formData.pharmacyLat}
                      lng={formData.pharmacyLng}
                      onLocationChange={({ lat, lng }) => setFormData(prev => ({ ...prev, pharmacyLat: lat, pharmacyLng: lng }))}
                    />
                    <div>
                      <label className="block text-sm font-medium mb-2">Opening Hours</label>
                      <input
                        type="text"
                        name="pharmacyOpeningHours"
                        value={formData.pharmacyOpeningHours}
                        onChange={(e) => setFormData(prev => ({ ...prev, pharmacyOpeningHours: e.target.value }))}
                        placeholder="e.g. 9 AM - 9 PM"
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
                      />
                    </div>
                  </>
                )}

                {formData.providerRole === 'delivery_agent' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="deliveryFullName"
                        value={formData.deliveryFullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, deliveryFullName: e.target.value }))}
                        placeholder="Dr. John Doe / City Labs"
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
                  </>
                )}

                {/* Common fields for provider roles */}
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

                {!isValid() && submitAttempted && (
                  <p className="text-xs text-red-600">Please fill all required fields and ensure passwords match.</p>
                )}
                <button type="submit" disabled={!isValid()} className={`w-full text-white px-4 py-2 rounded-md ${isValid() ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-300 cursor-not-allowed'}`}>Sign Up</button>
              </form>
            )}
          </div>

          <p className="text-slate-600 mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Log in</Link></p>
        </div>
      </div>

      {/* Map modal removed; AddressPicker provides map & current location */}
    </main>
  );
};

export default ProviderSignup;
