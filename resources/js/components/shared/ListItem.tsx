import { cn } from '@/lib/utils';

export default function ListItem({ children, className }) {
  return (
    <div
      className={cn(
        'relative mx-auto mb-4 w-full max-w-[400px] cursor-pointer rounded-lg p-4',
        // animation styles
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        // light styles
        'bg-bgDarker [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
        className
      )}
    >
      {children}
    </div>
  );
}
