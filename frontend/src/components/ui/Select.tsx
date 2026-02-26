import { SelectHTMLAttributes } from 'react';

type SelectVariant = 'primary' | 'gray';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  label?: string;
  options: string[];
  className?: string;
}

const Select = (props: SelectProps) => {
  const {
    variant = 'primary',
    label,
    options,
    className = '',
    ...rest
  } = props;

  const variants = {
    primary: 'bg-white',
    gray: 'bg-gray-50',
  };

  return (
    <label className={`w-full ${label ? 'flex flex-col gap-2' : ''}`}>
      {label && <span className="font-semibold">{label}</span>}
      <select
        className={`w-full ${variants[variant]} border border-filter-stroke px-3 py-2 rounded-xl focus:outline-none hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 placeholder:text-text-muted text-text-muted h-10 transition-all duration-200 ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt} value={opt.toLowerCase()}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
};

export default Select;
