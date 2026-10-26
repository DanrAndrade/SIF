import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Campo minimalista: só a linha de baixo, rótulo que sobe e linha verde que
// acende no foco.
export default function LoginField({
  label,
  type = 'text',
  value,
  onChange,
  name,
  autoComplete,
  invalid = false,
  style,
  className = '',
  autoFocus = false,
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const raised = focused || (value && value.length > 0);

  return (
    <div className={`relative ${className}`} style={style}>
      <div
        className={`lg-motion relative border-b transition-colors duration-300 ${
          invalid ? 'border-red-300' : 'border-gray-200 hover:border-gray-400'
        }`}
      >
        <label
          htmlFor={id}
          className={`lg-motion pointer-events-none absolute left-0 origin-left font-semibold transition-all duration-300 ${
            raised
              ? 'top-1 text-[10px] uppercase tracking-[0.14em] ' + (focused ? 'text-sif-green' : 'text-gray-400')
              : 'top-1/2 -translate-y-1/2 text-[15px] text-gray-400'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={isPassword && reveal ? 'text' : type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={invalid || undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`block w-full bg-transparent pb-2.5 pt-6 text-[15px] font-medium text-sif-ink outline-none ${
            isPassword ? 'pl-0 pr-12' : 'px-0'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-label={reveal ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={reveal}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-sif-green/5 hover:text-sif-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sif-green/30"
          >
            {reveal ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {/* linha que acende a partir do centro */}
        <span
          aria-hidden="true"
          className={`lg-motion absolute -bottom-px left-0 right-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-sif-green via-sif-leaf to-sif-green transition-transform duration-500 ease-out ${
            focused ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </div>
    </div>
  );
}
