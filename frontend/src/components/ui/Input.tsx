import { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
  ref?: Ref<HTMLInputElement>;
  className?: string;
}

const Input = (props: InputProps) => {
  const { label, error, id, ref, className = '', ...rest } = props;

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={id} className="font-medium text-text-base">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`bg-white border-2 border-nav-stroke rounded-full px-4 py-2.5 w-full outline-none transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted placeholder:text-sm hover:border-filter-stroke ${className}`}
        {...rest}
      />
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
