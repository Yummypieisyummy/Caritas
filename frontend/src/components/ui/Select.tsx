import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  className?: string;
}

const Select = (props: SelectProps) => {
  const { label, options, className = '', ...rest } = props;

  return (
    <label className={`w-full ${label ? 'flex flex-col gap-2' : ''}`}>
      {label && <span className="font-semibold">{label}</span>}
      <select
        className={`border border-filter-stroke px-3 py-2 rounded-xl bg-white focus:outline-none focus:border-accent-green placeholder:text-text-muted text-text-muted h-10 ${className}`}
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
