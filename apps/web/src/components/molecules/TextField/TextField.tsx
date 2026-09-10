import { InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'outlined';
  tone?: 'light' | 'inverted';
  icon?: string;
};

export function TextField({
  variant = 'outlined',
  tone = 'light',
  icon,
  className = '',
  ...props
}: TextFieldProps) {
  const isInverted = tone === 'inverted';

  return (
    <div
      data-variant={variant}
      data-tone={tone}
      className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
        isInverted ? 'border-white bg-transparent' : 'border-black/10 bg-white'
      } ${className}`}
    >
      {icon && (
        <span
          className={`material-symbols-outlined text-[20px] ${isInverted ? 'text-white' : 'text-slate-500'}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <input
        className={`w-full bg-transparent text-sm focus:outline-none ${
          isInverted ? 'text-white placeholder:text-white/70' : 'text-slate-900 placeholder:text-slate-400'
        }`}
        {...props}
      />
    </div>
  );
}
