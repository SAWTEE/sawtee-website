// @ts-nocheck
import { useEffect } from 'react';
import { Input } from '../ui/input';

// A debounced input react component
function DebouncedInput({
  className = '',
  value = undefined,
  setValue = undefined,
  onChange = undefined,
  debounce = 500,
  ...props
}) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setValue(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <Input
      className={className}
      {...props}
      value={value}
      onChange={e => setValue(e.target.value)}
    />
  );
}

export default DebouncedInput;
