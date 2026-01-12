import { InputHTMLAttributes, Ref } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  ref?: Ref<HTMLInputElement>;
  className?: string;
}

const Input = (props: InputProps) => {
  const { label, id, ref, className = '', ...rest } = props;

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
        className={`bg-white border-2 border-nav-stroke rounded-xl px-4 py-3 w-full outline-none transition-all duration-200 focus:border-accent-green focus:shadow-sm placeholder:text-text-muted hover:border-filter-stroke ${className}`}
        {...rest}
      />
    </div>
  );
};

export default Input;
