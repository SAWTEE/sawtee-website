import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type InputLabelProps = ComponentPropsWithoutRef<'label'> & {
  value?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function InputLabel({
  value,
  className = '',
  children,
  ...props
}: InputLabelProps) {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-secondary-foreground ${className}`}
    >
      {value ? value : children}
    </label>
  );
}
