import {
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

type CardWithEffectProps = {
  children?: ReactNode;
  className?: string;
};

const CardWithEffect = ({
  children = undefined,
  className = '',
}: CardWithEffectProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className={cn(
        'bg-bgDarker relative flex-1 overflow-hidden rounded-lg border border-black/8 transition-all duration-300 dark:border-white/10',
        'hover:border-theme-600/35 dark:hover:border-theme-600/40 hover:shadow-sm',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="spotlight pointer-events-none absolute z-10 rounded-full"
          style={
            {
              '--spot-x': `${mousePosition.x - 140}px`,
              '--spot-y': `${mousePosition.y - 140}px`,
            } as CSSProperties
          }
          aria-hidden
        />
      )}
      {children}
    </div>
  );
};

export default CardWithEffect;
