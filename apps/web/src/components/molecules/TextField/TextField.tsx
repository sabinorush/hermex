import { InputHTMLAttributes } from 'react';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'outlined';
  icon?: string;
};

export function TextField({ variant = 'outlined', icon, className = '', ...props }: TextFieldProps) {
  return (
    <div
      data-variant={variant}
      className={`flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 ${className}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[20px] text-slate-500" aria-hidden="true">
          {icon}
        </span>
      )}
      <input
        className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        {...props}
      />
    </div>
  );
}
