import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary';
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'bg-brand-primary-pure text-brand-secondary-pure hover:bg-brand-primary-pure/90'
      : 'bg-slate-900 text-white hover:bg-slate-700';

  return (
    <button
      className={`rounded-md px-4 py-2 text-sm font-medium ${variantClass} ${className}`}
      {...props}
    />
  );
}
