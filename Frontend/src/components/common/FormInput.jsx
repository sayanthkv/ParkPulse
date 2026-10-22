import React from 'react';

export default function FormInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = true,
  autoComplete = 'off',
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-[#0b0f17] border border-slate-800 focus:border-blue-500 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none transition duration-150 placeholder:text-slate-600"
      />
    </div>
  );
}