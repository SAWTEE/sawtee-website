import {
  forwardRef,
  useEffect,
  useRef,
  type InputHTMLAttributes,
} from 'react';

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
        className={`rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-muted dark:text-muted-foreground ${className}`}
        ref={input}
      />
    );
  }
);

export default TextInput;
