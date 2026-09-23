export default function DangerButton({
  className = '',
  disabled = undefined,
  children = undefined,
  ...props
}: any) {
  return (
    <button
      {...props}
      className={`bg-destructive hover:bg-destructive focus:ring-destructive active:bg-destructive inline-flex items-center rounded-md border border-transparent px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        disabled && 'opacity-25'
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
