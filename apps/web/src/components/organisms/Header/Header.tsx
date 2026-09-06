import { Logo } from '@/components/atoms/Logo';
import { NavLink, TextField } from '@/components/molecules';

export function Header() {
  return (
    <header className="w-full bg-brand-secondary-pure">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:gap-6 sm:px-6">
        <Logo variant="inverted" />
        <div className="hidden flex-1 sm:block">
          <TextField variant="outlined" icon="search" placeholder="O que você procura?" />
        </div>
        <nav className="ml-auto flex items-center gap-4 sm:ml-0 sm:gap-6">
          <NavLink href="/cadastro" icon="person_add">
            Cadastro
          </NavLink>
          <NavLink href="/login" icon="login">
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
