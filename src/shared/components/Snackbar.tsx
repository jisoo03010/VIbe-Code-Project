import { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Snackbar({ message, onUndo, onDismiss, duration = 3000 }: SnackbarProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="snackbar">
      <span className="snackbar__icon">✕</span>
      <span className="snackbar__msg">{message}</span>
      <button className="snackbar__undo" onClick={onUndo}>
        실행취소
      </button>
    </div>
  );
}
