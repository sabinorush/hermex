type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
};

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  label = placeholder,
  className = '',
}: DropdownProps) {
  return (
    <label className={`block ${className}`}>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full rounded-md border border-black/10 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-brand-primary-pure focus:ring-2 focus:ring-brand-primary-pure/30 focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export type { DropdownOption, DropdownProps };
