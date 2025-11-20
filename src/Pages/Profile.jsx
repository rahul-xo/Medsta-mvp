import React from 'react';
import { useAuthStore } from '@/Stores/authStore.js';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
        <p className="text-slate-600 mt-2">This is a placeholder page. We can wire form fields to update your profile details next.</p>
        <div className="mt-6 bg-white rounded-xl shadow p-6">
          <p className="text-sm text-slate-700"><span className="font-semibold">UID:</span> {user?.uid || '—'}</p>
          <p className="text-sm text-slate-700 mt-1"><span className="font-semibold">Email:</span> {user?.email || '—'}</p>
        </div>
      </div>
    </main>
  );
}
