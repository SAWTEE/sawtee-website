import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput(
  { type = 'text', className = '', isFocused = false, ...props },
  ref
) {
  const input = ref ? ref : useRef();

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, [input.current, isFocused]);

  return (
    <input
      {...props}
      type={type}
      className={`rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 dark:bg-muted dark:text-muted-foreground ${className}`}
      ref={input}
    />
  );
});
