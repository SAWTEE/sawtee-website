import { cn } from '@/lib/utils';
import { useState } from 'react';

const CardWithEffect = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = e => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      className={cn(
        'relative flex-1 cursor-pointer overflow-hidden rounded-xl border bg-bgDarker p-4 dark:border-[#33313d]',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform' }}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: '300px',
            height: '300px',
            top: mousePosition.y - 150,
            left: mousePosition.x - 150,
            background: 'rgba(64, 224, 208, 0.3)',
            filter: 'blur(100px)',
            transform: 'translate(-0%, -0%)',
            zIndex: 10, // Ensure the effect is on top
            willChange: 'transform, top, left',
          }}
        />
      )}
      {children}
    </div>
  );
};

export default CardWithEffect;
