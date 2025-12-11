import { InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  option: string;
  className?: string;
}

const Checkbox = (props: CheckboxProps) => {
  const { option, className = '', ...rest } = props;

  return (
    <label
      className={`flex items-center gap-2 cursor-pointer select-none text-sm ${className}`}
    >
      <input type="checkbox" className="accent-accent-green" {...rest} />
      {option}
    </label>
  );
};

export default Checkbox;
