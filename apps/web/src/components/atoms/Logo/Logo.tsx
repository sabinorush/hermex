type LogoProps = {
  variant?: 'default' | 'inverted';
  className?: string;
};

export function Logo({ variant = 'default', className = '' }: LogoProps) {
  const colorClass = variant === 'inverted' ? 'text-white' : 'text-brand-secondary-pure';

  return (
    <span className={`text-xl font-bold tracking-tight ${colorClass} ${className}`}>Hermex</span>
  );
}
