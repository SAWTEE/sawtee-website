import { useEffect, useRef } from 'react';

import useMousePosition from '@/lib/mouse-position';

import { useTheme } from '../shared/theme-provider';

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

type ParticlesProps = {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
};

export default function Particles({
  className = '',
  quantity = 30,
  staticity = 50,
  ease = 50,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const rafId = useRef(0);

  const theme = useTheme().theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    context.current = canvas.getContext('2d');
    initCanvas();
    rafId.current = window.requestAnimationFrame(animate);
    window.addEventListener('resize', initCanvas);

    return () => {
      window.removeEventListener('resize', initCanvas);
      window.cancelAnimationFrame(rafId.current);
    };
    // Re-init when theme changes so particle color updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate/init read latest refs
  }, [theme]);

  useEffect(() => {
    onMouseMove();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync canvas-local mouse from hook
  }, [mousePosition.x, mousePosition.y]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const { w, h } = canvasSize.current;
    const x = mousePosition.x - rect.left - w / 2;
    const y = mousePosition.y - rect.top - h / 2;
    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
    if (inside) {
      mouse.current.x = x;
      mouse.current.y = y;
    }
  };

  const resizeCanvas = () => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    const ctx = context.current;
    if (!container || !canvas || !ctx) {
      return;
    }

    circles.current.length = 0;
    canvasSize.current.w = container.offsetWidth;
    canvasSize.current.h = container.offsetHeight;
    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const size = Math.floor(Math.random() * 2) + 1;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size,
      alpha: 0,
      targetAlpha,
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4,
    };
  };

  const drawCircle = (circle: Circle, update = false) => {
    const ctx = context.current;
    if (!ctx) {
      return;
    }

    const { x, y, translateX, translateY, size, alpha } = circle;
    ctx.translate(translateX, translateY);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle =
      theme === 'dark'
        ? `rgba(255, 255, 255, ${alpha})`
        : `rgba(0, 0, 0, ${alpha})`;
    ctx.fill();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!update) {
      circles.current.push(circle);
    }
  };

  const clearContext = () => {
    const ctx = context.current;
    if (!ctx) {
      return;
    }
    ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  };

  const drawParticles = () => {
    clearContext();
    for (let i = 0; i < quantity; i++) {
      drawCircle(circleParams());
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ) => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle, i) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2)
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(circleParams());
      } else {
        drawCircle(circle, true);
      }
    });
    rafId.current = window.requestAnimationFrame(animate);
  };

  return (
    <div className={className} ref={canvasContainerRef} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
