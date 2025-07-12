
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
  const isMobile = useIsMobile();

  // Return empty handlers to maintain compatibility
  return {
    touchHandlers: {},
    swiping: false,
  };
};
