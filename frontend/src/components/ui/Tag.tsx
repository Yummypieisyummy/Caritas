import { Children, ReactNode } from 'react';

// Defined colors
export type TagColor = 'green' | 'blue' | 'orange' | 'baise' | 'purple';

interface TagProps {
  color?: TagColor; // Default 'green'
  children?: ReactNode;
  className?: string;
}

const Tag = (props: TagProps) => {
  const colors = {
    green: 'bg-tag-green',
    blue: 'bg-tag-blue',
    orange: 'bg-tag-orange',
    baise: 'bg-tag-baise',
    purple: 'bg-tag-purple',
  };

  const { children, className = '', color = 'green' } = props;
  return (
    <span
      className={`px-3 py-1 rounded-2xl text-sm inline-flex items-center justify-center ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;
