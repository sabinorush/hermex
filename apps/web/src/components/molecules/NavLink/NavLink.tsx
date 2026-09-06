import Link from 'next/link';
import { ReactNode } from 'react';

type NavLinkProps = {
  href: string;
  icon: string;
  children: ReactNode;
  className?: string;
};

export function NavLink({ href, icon, children, className = '' }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-white hover:text-white/80 ${className}`}
    >
      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
        {icon}
      </span>
      {children}
    </Link>
  );
}
