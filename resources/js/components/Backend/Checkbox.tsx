import type { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`text-theme-600 focus:ring-theme-600 rounded border-gray-300 shadow-sm ${className}`}
    />
  );
}
