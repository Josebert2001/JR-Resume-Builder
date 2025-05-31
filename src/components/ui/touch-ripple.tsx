
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface TouchRippleProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TouchRipple = ({ 
  children, 
  className,
  disabled = false
}: TouchRippleProps) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const isMobile = useIsMobile();

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || !isMobile) return;

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { x, y, id }]);

    // Remove the ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden touch-none",
        className
      )}
      onTouchStart={handleTouchStart}
    >
      {children}
      {ripples.map(({ x, y, id }) => (
        <span
          key={id}
          className="absolute rounded-full bg-white/20 animate-ripple pointer-events-none"
          style={{
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            width: '200%',
            paddingBottom: '200%',
          }}
        />
      ))}
    </div>
  );
};
