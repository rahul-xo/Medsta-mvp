import React, { useState, useEffect } from 'react';

export default function OtpModal({ open, phone, onSubmit, onClose, isSubmitting }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCode('');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code || code.length < 4) {
      setError('Please enter the OTP sent to your phone');
      return;
    }
    onSubmit(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Verify your phone</h2>
        <p className="text-sm text-slate-600 mb-4">We sent an OTP to <span className="font-medium">{phone}</span>. Enter it below to verify.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-md"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 bg-white">Cancel</button>
            <button type="submit" disabled={isSubmitting} className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>Verify</button>
          </div>
        </form>
      </div>
    </div>
  );
}
