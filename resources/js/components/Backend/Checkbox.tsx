import type { InputHTMLAttributes } from 'react';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      className={`rounded border-gray-300 text-sky-600 shadow-sm focus:ring-sky-500 ${className}`}
    />
  );
}
