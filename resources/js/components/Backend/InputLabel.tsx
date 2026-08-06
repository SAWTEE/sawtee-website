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
      className={`text-secondary-foreground block text-sm font-medium ${className}`}
    >
      {value ? value : children}
    </label>
  );
}
