import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  className?: string;
}

const Select = (props: SelectProps) => {
  const { label, options, className = '', ...rest } = props;

  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-semibold text-lg">{label}</span>
      <select
        className={`border border-filter-stroke px-3 py-2 rounded-lg bg-white focus:outline-none focus:border-accent-green text-text-muted ${className}`}
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
