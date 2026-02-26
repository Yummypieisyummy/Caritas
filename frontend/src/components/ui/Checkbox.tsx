import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  option: string;
  className?: string;
}

const Checkbox = ({ option, className = '', ...rest }: CheckboxProps) => {
  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none ${className}`}
    >
      <input type="checkbox" className="accent-accent-green" {...rest} />
      {option}
    </label>
  );
};

export default Checkbox;
