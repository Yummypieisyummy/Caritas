// Reusable button
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

// Defined styles
type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'textOnly';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  variant?: ButtonVariant; // Default 'primary'
  size?: ButtonSize; // Default 'md'
  children?: ReactNode;
}

interface ButtonAsButtonProps
  extends BaseButtonProps, ButtonHTMLAttributes<HTMLButtonElement> {
  //
  as?: 'button'; // Discriminator for regular buttons
  className?: string;
}

interface ButtonAsLinkProps extends BaseButtonProps {
  as: 'link'; // Discriminator for link buttons - required
  to: string; // required destination
  className?: string | ((props: { isActive: boolean }) => string); // Special type
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps; // ButtonProps can be either a normal button or a link

const Button = (props: ButtonProps) => {
  const baseStyles =
    'rounded-2xl cursor-pointer inline-flex items-center justify-center transition-opacity duration-200';

  const variants = {
    primary: 'bg-accent-green text-white shadow-sm hover:opacity-90',
    secondary:
      'bg-white border-1 border-accent-green shadow-sm hover:text-text-green hover:opacity-90',
    icon: 'hover:opacity-85',
    textOnly: 'hover:opacity-85',
  };

  const getSizes = (variant: ButtonVariant, size: ButtonSize) => {
    if (variant === 'textOnly') return 'px-1 py-0';

    const sizesMap = {
      sm: 'px-2.5 py-2 text-sm font-medium',
      md: 'px-4 py-2 text-lg font-semibold',
      lg: 'px-6 py-2.5 text-xl font-semibold',
    };

    return sizesMap[size];
  };

  const variant = props.variant || 'primary';
  const size = props.size || 'md';
  const sizeStyle = getSizes(variant, size);

  // Render links
  if (props.as === 'link') {
    const { to, children, className = '' } = props;

    return (
      <NavLink
        to={to}
        className={
          typeof className === 'function'
            ? (navProps) =>
                `${baseStyles} ${variants[variant]} ${sizeStyle} ${className(
                  navProps,
                )}`
            : `${baseStyles} ${variants[variant]} ${sizeStyle} ${className}`
        }
      >
        {children}
      </NavLink>
    );
  }

  // Render normal buttons
  const { children, className = '', ...rest } = props;

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeStyle} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
