import { useEffect, useRef, TouchEvent } from 'react';
import { useIsMobile } from './use-mobile';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  disableVertical?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
  disableVertical = true
}: SwipeConfig) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isMobile = useIsMobile();

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Only process horizontal swipes if vertical swipes are disabled and the vertical movement is significant
    if (disableVertical && Math.abs(deltaY) > threshold) {
      touchStartRef.current = null;
      return;
    }

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    touchStartRef.current = null;
  };

  return {
    touchHandlers: isMobile ? {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    } : {},
  };
};