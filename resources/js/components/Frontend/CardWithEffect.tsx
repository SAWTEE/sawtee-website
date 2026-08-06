import { cn } from '@/lib/utils';
import { useState, type MouseEvent, type ReactNode } from 'react';

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
        'bg-bgDarker relative flex-1 overflow-hidden rounded-lg border border-black/8 transition-[border-color,box-shadow] duration-300 dark:border-white/10',
        'hover:border-[#006181]/35 hover:shadow-sm dark:hover:border-[#006181]/40',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '280px',
            height: '280px',
            top: mousePosition.y - 140,
            left: mousePosition.x - 140,
            background: 'rgba(0, 97, 129, 0.12)',
            filter: 'blur(80px)',
            zIndex: 10,
            willChange: 'transform, top, left',
          }}
          aria-hidden
        />
      )}
      {children}
    </div>
  );
};

export default CardWithEffect;
