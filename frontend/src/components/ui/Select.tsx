// import { SelectHTMLAttributes } from 'react';

// type SelectVariant = 'primary' | 'gray' | 'form';

// interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
//   variant?: SelectVariant;
//   label?: string;
//   options: string[];
//   error?: string;
//   className?: string;
// }

// const Select = ({
//   variant = 'primary',
//   label,
//   options,
//   error,
//   className = '',
//   ...rest
// }: SelectProps) => {
//   const variants = {
//     primary: 'bg-white',
//     gray: 'bg-gray-50',
//     form: 'outline-none border-2 border-nav-stroke',
//   };

//   //   const baseStyles =
//   // 'outline-none transition-all duration-200 placeholder:text-text-muted';

//   //   primary:
//   //  'border-2 bg-white border-nav-stroke rounded-2xl placeholder:text-sm hover:border-filter-stroke focus:border-accent-green focus:shadow-sm',

//   return (
//     <label className={`${label ? 'w-full flex flex-col gap-2' : ''}`}>
//       {label && <span className="font-semibold">{label}</span>}
//       <select
//         className={`w-full ${variants[variant]} border border-filter-stroke px-3 py-2 rounded-xl focus:outline-none hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 placeholder:text-text-muted text-text-muted h-10 transition-all duration-200 ${className}`}
//         {...rest}
//       >
//         {options.map((opt) => (
//           <option key={opt} value={opt.toLowerCase()}>
//             {opt}
//           </option>
//         ))}
//       </select>
//       {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
//     </label>
//   );
// };

// export default Select;

import { SelectHTMLAttributes } from 'react';

type SelectVariant = 'primary' | 'gray' | 'form';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  variant?: SelectVariant;
  label?: string;
  options: string[];
  placeholder?: string;
  error?: string;
  className?: string;
}

const Select = ({
  variant = 'primary',
  label,
  options,
  placeholder,
  error,
  className = '',
  ...rest
}: SelectProps) => {
  const baseStyles =
    'w-full transition-all duration-200 placeholder:text-text-muted text-text-muted';

  const variants: Record<SelectVariant, string> = {
    primary:
      'bg-white border border-filter-stroke px-3 py-2 rounded-xl focus:outline-none hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 h-10',
    gray: 'bg-gray-50 border border-filter-stroke px-3 py-2 rounded-xl focus:outline-none hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10 h-10',
    form: 'placeholder:text-sm outline-none border-2 border-nav-stroke px-4 py-2.5 rounded-2xl bg-white hover:border-filter-stroke focus:border-accent-green focus:shadow-sm',
  };

  return (
    <label className={`${label ? 'w-full flex flex-col gap-2' : ''}`}>
      {label && <span className="font-semibold">{label}</span>}
      <select
        className={`${baseStyles} ${variants[variant]} ${className}`}
        defaultValue={placeholder ? '' : options[0]}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </label>
  );
};

export default Select;
