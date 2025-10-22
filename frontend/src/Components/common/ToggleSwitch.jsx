import React from 'react';

const ToggleSwitch = ({ checked, onChange, label, description }) => {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-md border border-slate-200">
      <div>
        {label && <p className="text-sm font-medium">{label}</p>}
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <button
        type="button"
        aria-pressed={!!checked}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-slate-300'}`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );
};

export default ToggleSwitch;
