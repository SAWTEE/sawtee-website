import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type InputErrorProps = Omit<ComponentPropsWithoutRef<'p'>, 'children'> & {
  message?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Legacy Chakra-era spacing prop; ignored. */
  mt?: number | string;
};

export default function InputError({
  message,
  className = '',
  children,
  mt: _mt,
  ...props
}: InputErrorProps) {
  const content = message ?? children;

  return content ? (
    <p
      {...props}
      role="alert"
      className={`text-sm text-destructive ${className}`}
    >
      {content}
    </p>
  ) : null;
}
