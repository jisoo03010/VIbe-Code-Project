import { useState, useRef, useCallback, type ReactNode } from 'react';

interface SwipeToDeleteProps {
  children: ReactNode;
  onDelete: () => void;
}

const THRESHOLD = 80;
const COLLAPSE_DURATION = 250;

export function SwipeToDelete({ children, onDelete }: SwipeToDeleteProps) {
  const [offsetX, setOffsetX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [removing, setRemoving] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const locked = useRef(false);
  const isHorizontal = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    locked.current = false;
    isHorizontal.current = false;
    setDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;

    if (!locked.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      locked.current = true;
      isHorizontal.current = Math.abs(dx) > Math.abs(dy);
      if (!isHorizontal.current) {
        setDragging(false);
        return;
      }
    }

    if (isHorizontal.current && dx > 0) {
      setOffsetX(dx);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    if (offsetX > THRESHOLD) {
      setRemoving(true);
      setTimeout(onDelete, COLLAPSE_DURATION);
    } else {
      setOffsetX(0);
    }
  }, [offsetX, onDelete]);

  return (
    <div
      className={`swipe-wrapper${removing ? ' swipe-wrapper--removing' : ''}`}
      style={{ '--swipe-duration': `${COLLAPSE_DURATION}ms` } as React.CSSProperties}
    >
      <div
        className="swipe-content"
        style={{
          transform: `translateX(${removing ? '100%' : `${offsetX}px`})`,
          transition: dragging ? 'none' : 'transform 0.25s ease',
          opacity: removing ? 0 : 1,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  );
}
