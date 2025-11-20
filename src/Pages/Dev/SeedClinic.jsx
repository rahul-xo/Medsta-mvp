import React, { useState } from 'react';
import { supabase } from '@/Services/supabase.js';
import { useAuthStore } from '@/Stores/authStore.js';

const SeedClinic = () => {
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [clinic, setClinic] = useState({
    clinicName: 'CarePlus Clinic',
    clinicAddress: '',
    clinicLat: null,
    clinicLng: null,
    videoConsultation: true,
    contactEmail: '',
    contactPhone: '',
    consultationFeeDefault: 600,
  });
  const [doctors, setDoctors] = useState([
    { fullName: 'Dr. A. Sharma', specialization: 'Cardiology', yearsExperience: 12, consultationFee: 700, medicalRegNumber: 'MMC/2020/12345' },
  ]);

  const canWrite = !!user?.uid;

  const onSave = async () => {
    if (!canWrite) {
      setMsg('Please login as a provider to seed a clinic document.');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      const specializations = Array.from(new Set(doctors.map((d) => d.specialization).filter(Boolean)));
      const payload = {
        id: user.uid,
        ...clinic,
        doctors: doctors.map((d, idx) => ({ id: `${Date.now()}-${idx}`, ...d })),
        specializations,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { error } = await supabase.from('providers_clinics').upsert([payload], { onConflict: 'id' });
      if (error) throw error;
      setMsg('Clinic document saved successfully to providers_clinics (Supabase).');
    } catch (e) {
      console.error(e);
      setMsg(e.message || 'Failed to save clinic');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold">Dev: Seed Clinic</h1>
        <p className="text-sm text-gray-600 mt-1">Write a correctly-shaped providers_clinics document for the current user.</p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Clinic Name</label>
            <input className="w-full mt-1 px-3 py-2 border rounded" value={clinic.clinicName} onChange={(e) => setClinic((c) => ({ ...c, clinicName: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Video Consultation</label>
            <select className="w-full mt-1 px-3 py-2 border rounded" value={clinic.videoConsultation ? 'yes' : 'no'} onChange={(e) => setClinic((c) => ({ ...c, videoConsultation: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium">Address</label>
            <input className="w-full mt-1 px-3 py-2 border rounded" value={clinic.clinicAddress} onChange={(e) => setClinic((c) => ({ ...c, clinicAddress: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Latitude</label>
            <input type="number" className="w-full mt-1 px-3 py-2 border rounded" value={clinic.clinicLat ?? ''} onChange={(e) => setClinic((c) => ({ ...c, clinicLat: e.target.value ? Number(e.target.value) : null }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Longitude</label>
            <input type="number" className="w-full mt-1 px-3 py-2 border rounded" value={clinic.clinicLng ?? ''} onChange={(e) => setClinic((c) => ({ ...c, clinicLng: e.target.value ? Number(e.target.value) : null }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Default Fee</label>
            <input type="number" className="w-full mt-1 px-3 py-2 border rounded" value={clinic.consultationFeeDefault} onChange={(e) => setClinic((c) => ({ ...c, consultationFeeDefault: Number(e.target.value || 0) }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Contact Email</label>
            <input className="w-full mt-1 px-3 py-2 border rounded" value={clinic.contactEmail} onChange={(e) => setClinic((c) => ({ ...c, contactEmail: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium">Contact Phone</label>
            <input className="w-full mt-1 px-3 py-2 border rounded" value={clinic.contactPhone} onChange={(e) => setClinic((c) => ({ ...c, contactPhone: e.target.value }))} />
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Doctors</h2>
          {doctors.map((d, i) => (
            <div key={i} className="mt-3 p-3 border rounded">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="px-3 py-2 border rounded" placeholder="Full name" value={d.fullName} onChange={(e) => { const arr=[...doctors]; arr[i]={...arr[i], fullName:e.target.value}; setDoctors(arr);} } />
                <input className="px-3 py-2 border rounded" placeholder="Specialization" value={d.specialization} onChange={(e) => { const arr=[...doctors]; arr[i]={...arr[i], specialization:e.target.value}; setDoctors(arr);} } />
                <input type="number" className="px-3 py-2 border rounded" placeholder="Years of experience" value={d.yearsExperience} onChange={(e) => { const arr=[...doctors]; arr[i]={...arr[i], yearsExperience:Number(e.target.value||0)}; setDoctors(arr);} } />
                <input type="number" className="px-3 py-2 border rounded" placeholder="Consultation fee" value={d.consultationFee} onChange={(e) => { const arr=[...doctors]; arr[i]={...arr[i], consultationFee:Number(e.target.value||0)}; setDoctors(arr);} } />
                <input className="px-3 py-2 border rounded sm:col-span-2" placeholder="Medical reg. number (optional)" value={d.medicalRegNumber||''} onChange={(e) => { const arr=[...doctors]; arr[i]={...arr[i], medicalRegNumber:e.target.value}; setDoctors(arr);} } />
              </div>
              <div className="mt-2 text-right">
                {doctors.length > 1 && (
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded" onClick={() => setDoctors((arr) => arr.filter((_, idx) => idx !== i))}>Remove</button>
                )}
              </div>
            </div>
          ))}
          <button className="mt-3 px-4 py-2 bg-blue-100 text-blue-700 rounded" onClick={() => setDoctors((arr) => [...arr, { fullName: '', specialization: '', yearsExperience: 0, consultationFee: 0 }])}>+ Add doctor</button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button disabled={!canWrite || saving} onClick={onSave} className={`px-4 py-2 rounded text-white ${saving? 'bg-gray-400':'bg-green-600 hover:bg-green-700'}`}>{saving? 'Saving…' : 'Save clinic document'}</button>
          <span className="text-sm text-gray-600">Doc path: providers_clinics/{user?.uid || 'YOUR_UID'}</span>
        </div>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </main>
  );
};

export default SeedClinic;
