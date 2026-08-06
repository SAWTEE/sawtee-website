export default function DangerButton({
  className = '',
  disabled = undefined,
  children = undefined,
  ...props
}: any) {
  return (
    <button
      {...props}
      className={`inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none active:bg-red-700 ${
        disabled && 'opacity-25'
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
