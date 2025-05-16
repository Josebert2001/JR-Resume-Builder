
import { useEffect, useRef, TouchEvent, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  disableVertical?: boolean;
  disableHorizontal?: boolean;
}

export const useSwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  disableVertical = true,
  disableHorizontal = false
}: SwipeConfig) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [swiping, setSwiping] = useState(false);
  const isMobile = useIsMobile();

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    };
    setSwiping(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // If significant movement detected, set swiping to true
    if (Math.abs(deltaX) > threshold / 2 || Math.abs(deltaY) > threshold / 2) {
      setSwiping(true);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Only process horizontal swipes if vertical swipes are disabled and the vertical movement is significant
    if (disableVertical && Math.abs(deltaY) > threshold) {
      touchStartRef.current = null;
      setSwiping(false);
      return;
    }

    // Only process vertical swipes if horizontal swipes are disabled and the horizontal movement is significant
    if (disableHorizontal && Math.abs(deltaX) > threshold) {
      touchStartRef.current = null;
      setSwiping(false);
      return;
    }

    if (Math.abs(deltaX) > threshold && !disableHorizontal) {
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    if (Math.abs(deltaY) > threshold && !disableVertical) {
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStartRef.current = null;
    setSwiping(false);
  };

  return {
    touchHandlers: isMobile ? {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    } : {},
    swiping,
  };
};
