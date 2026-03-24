import { useState, useRef, useCallback, type ReactNode } from 'react';

interface BottomSheetProps {
  children: ReactNode;
  onClose: () => void;
}

const SNAP_HALF = 55;
const SNAP_FULL = 90;
const DRAG_THRESHOLD = 60;
const CLOSE_DURATION = 300;

export function BottomSheet({ children, onClose }: BottomSheetProps) {
  const [snap, setSnap] = useState<'half' | 'full'>('half');
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const startY = useRef(0);

  const currentVh = snap === 'full' ? SNAP_FULL : SNAP_HALF;

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION);
  }, [onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dy = e.touches[0].clientY - startY.current;
    setDragOffset(dy);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setDragging(false);

    if (dragOffset < -DRAG_THRESHOLD) {
      setSnap('full');
    } else if (dragOffset > DRAG_THRESHOLD) {
      if (snap === 'full') {
        setSnap('half');
      } else {
        handleClose();
      }
    }

    setDragOffset(0);
  }, [dragOffset, snap, handleClose]);

  const translatePx = dragging ? dragOffset : 0;

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={handleClose} />
      <div
        className={`bottom-sheet ${dragging ? '' : 'bottom-sheet--animated'} ${closing ? 'bottom-sheet--closing' : ''}`}
        style={{
          height: `${currentVh}vh`,
          transform: closing ? undefined : `translateY(${translatePx}px)`,
        }}
      >
        <div
          className="bottom-sheet__handle-area"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="bottom-sheet__handle" />
        </div>
        <div className="bottom-sheet__content">
          {children}
        </div>
      </div>
    </>
  );
}
