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
  extends BaseButtonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
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
    'rounded-lg cursor-pointer inline-flex items-center justify-center transition-opacity duration-200';

  const variants = {
    primary:
      'bg-accent-green text-white border border-accent-green hover:opacity-90',
    secondary: 'bg-white border border-accent-green hover:opacity-85',
    icon: 'bg-sky-500 hover:opacity-90 ',
    textOnly: 'hover:opacity-80',
  };

  const sizes = {
    sm: 'px-2.5 py-1',
    md: 'px-4 py-2 text-lg',
    lg: 'px-6 py-2.5 text-xl font-medium',
  };

  // Render links
  if (props.as === 'link') {
    const {
      to,
      children,
      className = '',
      variant = 'primary',
      size = 'md',
    } = props;

    return (
      <NavLink
        to={to}
        className={
          typeof className === 'function'
            ? (navProps) =>
                `${baseStyles} ${variants[variant]} ${sizes[size]} ${className(
                  navProps
                )}`
            : `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`
        }
      >
        {children}
      </NavLink>
    );
  }

  // Render normal buttons
  const {
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    ...rest
  } = props;
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
