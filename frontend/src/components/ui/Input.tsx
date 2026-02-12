import { InputHTMLAttributes, Ref } from 'react';

type InputVariant = 'primary' | 'secondary';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  label?: string;
  id: string;
  error?: string;
  className?: string;
}

const Input = (props: InputProps) => {
  const { label, error, id, className = '', ...rest } = props;

  const baseStyles = 'bg-white outline-none transition-all duration-200';

  const variants = {
    primary:
      'border-2 border-nav-stroke rounded-full px-4 py-2.5 w-full transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted placeholder:text-sm hover:border-filter-stroke',
    secondary:
      'border border-filter-stroke px-3 py-2 rounded-xl bg-white focus:outline-none focus:border-accent-green placeholder:text-text-muted h-10',
  };

  const variant = props.variant || 'primary';

  return (
    <div className={`flex flex-col ${label ? 'gap-2' : ''}`}>
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...rest}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
