import type { ReactNode } from 'react';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  id: string;
  label: ReactNode;
  error?: string | string[] | null;
  description?: ReactNode;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
  }) => ReactNode;
};

/**
 * shadcn Field wrapper for Inertia validation errors.
 * Pass control via children render prop so aria-invalid is applied consistently.
 */
export default function FormField({
  id,
  label,
  error,
  description,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  const invalid = Boolean(message);
  const describedBy = invalid
    ? `${id}-error`
    : description
      ? `${id}-description`
      : undefined;

  return (
    <Field
      data-invalid={invalid || undefined}
      className={cn('gap-2', className)}
    >
      <FieldLabel htmlFor={id}>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </FieldLabel>
      {children({
        id,
        'aria-invalid': invalid,
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
      })}
      {invalid ? (
        <FieldError id={`${id}-error`}>{message}</FieldError>
      ) : description ? (
        <FieldDescription id={`${id}-description`}>
          {description}
        </FieldDescription>
      ) : null}
    </Field>
  );
}
