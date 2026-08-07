type ToastFn = (props: {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}) => unknown;

/**
 * Show the first validation error without clearing form fields.
 * Field-level InputError components remain the primary feedback.
 */
export function toastFormErrors(
  errors: Record<string, string | string[] | undefined>,
  toast: ToastFn,
  options?: { title?: string }
): void {
  const entry = Object.entries(errors).find(
    ([, message]) => message != null && message !== ''
  );

  if (!entry) {
    return;
  }

  const [field, message] = entry;
  const text = Array.isArray(message) ? message[0] : message;

  toast({
    title: options?.title ?? 'Please fix the highlighted fields',
    description: `${field}: ${text}`,
    variant: 'destructive',
  });
}

export function humanFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
