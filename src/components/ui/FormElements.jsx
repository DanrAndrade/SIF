import React from 'react';

export function Input({ label, icon: Icon, className = '', ...props }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">{label}</label>}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D91A3C] transition-colors">
            <Icon size={20} />
          </div>
        )}
        <input 
          className={`w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 ${Icon ? 'pl-12' : 'px-4'} pr-4 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937] placeholder:text-gray-400`}
          {...props}
        />
      </div>
    </div>
  );
}

export function Select({ label, options = [], className = '', ...props }) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">{label}</label>}
        <div className="relative group">
            <select 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937] appearance-none cursor-pointer"
            {...props}
            >
                {options.map((opt, i) => (
                    <option key={i} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
      </div>
    );
  }

export function TextArea({ label, className = '', ...props }) {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-2">{label}</label>}
        <textarea 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#D91A3C] focus:bg-white transition-all font-medium text-[#1f2937] resize-none"
          {...props}
        />
      </div>
    );
  }