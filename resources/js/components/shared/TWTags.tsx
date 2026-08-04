import React from 'react';

export default function TWTags({ children, colorScheme = 'blue', ...rest }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-${colorScheme}-50 text-${colorScheme}-600 ring-${colorScheme}-500/10`}
      {...rest}
    >
      {children}
    </span>
  );
}
