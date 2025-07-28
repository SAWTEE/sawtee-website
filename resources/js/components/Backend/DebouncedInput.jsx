import { useEffect } from 'react';
import { Input } from '../ui/input';

// A debounced input react component
function DebouncedInput({
  className,
  value,
  setValue,
  onChange,
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
