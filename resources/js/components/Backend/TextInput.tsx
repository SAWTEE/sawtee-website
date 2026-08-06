import { forwardRef, type InputHTMLAttributes, useEffect, useRef } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  isFocused?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref
  ) {
    const localRef = useRef<HTMLInputElement>(null);
    const input = (ref as React.RefObject<HTMLInputElement> | null) ?? localRef;

    useEffect(() => {
      if (isFocused) {
        input.current?.focus();
      }
    }, [isFocused, input]);

    return (
      <input
        {...props}
        type={type}
        className={`border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-theme-600 focus:ring-theme-600 rounded-md border shadow-sm ${className}`}
        ref={input}
      />
    );
  }
);

export default TextInput;
