import { InputHTMLAttributes } from 'react';

type InputVariant = 'primary' | 'secondary';
type InputSize = 'sm' | 'md';

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: InputVariant; // Default primary
  size?: InputSize; // Default medium
  label?: string;
  id: string;
  error?: string;
  className?: string;
}

const Input = (props: InputProps) => {
  const {
    label,
    error,
    id,
    className = '',
    size = 'md',
    variant = 'primary',
    ...rest
  } = props;

  const baseStyles =
    'outline-none transition-all duration-200 placeholder:text-text-muted';

  const variants = {
    primary:
      'border-2 bg-white border-nav-stroke rounded-2xl placeholder:text-sm hover:border-filter-stroke focus:border-accent-green focus:shadow-sm',
    secondary:
      'border border-filter-stroke bg-gray-50 rounded-xl h-10 hover:border-accent-green/50 focus:border-accent-green focus:ring-2 focus:ring-accent-green/10',
  };

  const sizes = {
    sm: 'px-3 py-2 placeholder:text-sm',
    md: 'px-4 py-2.5',
  };

  return (
    <div className={`w-full flex flex-col ${label ? 'gap-2' : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className={`font-medium ${size === 'sm' ? 'text-sm' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${size === 'sm' ? 'text-sm' : ''}`}
        {...rest}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
