import React, { useState } from 'react';
import { supabase } from '@/Services/supabase.js';
import { useAuthStore } from '@/Stores/authStore.js';

const SeedOthers = () => {
  const user = useAuthStore((s) => s.user);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [data, setData] = useState({
    businessName: 'MedEquip Rentals',
    category: 'Medical Equipment',
    address: '',
    lat: null,
    lng: null,
    email: '',
    phone: '',
    openingHours: {
      mon: { open: '09:00', close: '19:00' },
      sun: { closed: true },
    },
    services: ['Wheelchair', 'Oxygen Concentrator'],
    status: 'pending',
  });

  const canWrite = !!user?.uid;

  const onSave = async () => {
    if (!canWrite) { setMsg('Login as a provider to seed others doc.'); return; }
    setSaving(true); setMsg('');
    try {
      const payload = {
        id: user.uid,
        businessName: data.businessName,
        category: data.category,
        address: data.address || null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        email: data.email || null,
        phone: data.phone || null,
        openingHours: data.openingHours || null,
        services: data.services || [],
        status: data.status || 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const { error } = await supabase.from('providers_others').upsert([payload], { onConflict: 'id' });
      if (error) throw error;
      setMsg('Other provider saved to providers_others (Supabase).');
    } catch (e) {
      console.error(e); setMsg(e.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <main className="min-h-screen pt-20 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold">Dev: Seed Other Provider</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <input className="px-3 py-2 border rounded" placeholder="Business name" value={data.businessName} onChange={(e)=>setData(d=>({...d,businessName:e.target.value}))} />
          <input className="px-3 py-2 border rounded" placeholder="Category (e.g., Ambulance)" value={data.category} onChange={(e)=>setData(d=>({...d,category:e.target.value}))} />
          <input className="px-3 py-2 border rounded sm:col-span-2" placeholder="Address" value={data.address} onChange={(e)=>setData(d=>({...d,address:e.target.value}))} />
          <input type="number" className="px-3 py-2 border rounded" placeholder="Lat" value={data.lat ?? ''} onChange={(e)=>setData(d=>({...d,lat:e.target.value?Number(e.target.value):null}))} />
          <input type="number" className="px-3 py-2 border rounded" placeholder="Lng" value={data.lng ?? ''} onChange={(e)=>setData(d=>({...d,lng:e.target.value?Number(e.target.value):null}))} />
          <input className="px-3 py-2 border rounded" placeholder="Email" value={data.email} onChange={(e)=>setData(d=>({...d,email:e.target.value}))} />
          <input className="px-3 py-2 border rounded" placeholder="Phone" value={data.phone} onChange={(e)=>setData(d=>({...d,phone:e.target.value}))} />
        </div>
        <div className="mt-6 flex items-center gap-3">
          <button disabled={!canWrite||saving} onClick={onSave} className={`px-4 py-2 rounded text-white ${saving?'bg-gray-400':'bg-green-600 hover:bg-green-700'}`}>{saving?'Saving…':'Save other provider'}</button>
          <span className="text-sm text-gray-600">Doc path: providers_others/{user?.uid || 'YOUR_UID'}</span>
        </div>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </main>
  );
};

export default SeedOthers;
