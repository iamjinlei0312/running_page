import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import styles from './style.module.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) => {
  const [animate, setAnimate] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => {
      setAnimate(true);
      sheetRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      setAnimate(false);
      setDragOffset(0);
      dragStartRef.current = null;
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.overlay} ${animate ? styles.overlayActive : ''}`}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className={`${styles.sheet} ${animate ? styles.sheetActive : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={
          dragOffset
            ? { transform: `translateY(${dragOffset}px)`, transition: 'none' }
            : undefined
        }
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
          if (event.key !== 'Tab') return;
          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button, a[href], select, summary, [tabindex="0"]'
            )
          ).filter((element) => element.getClientRects().length > 0);
          const first = focusable[0];
          const last = focusable.at(-1);
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            last?.focus();
          } else if (
            !event.shiftKey &&
            (document.activeElement === last ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        <div
          className={styles.header}
          onTouchStart={(event) => {
            dragStartRef.current = event.touches[0].clientY;
          }}
          onTouchMove={(event) => {
            if (dragStartRef.current !== null) {
              setDragOffset(
                Math.max(0, event.touches[0].clientY - dragStartRef.current)
              );
            }
          }}
          onTouchEnd={() => {
            if (dragOffset > 100) onClose();
            dragStartRef.current = null;
            setDragOffset(0);
          }}
          onTouchCancel={() => {
            dragStartRef.current = null;
            setDragOffset(0);
          }}
        >
          <div className={styles.handle} />
        </div>
        <div className={styles.statsHeader}>
          <h2 id={titleId} className={styles.yearTitle}>
            {title}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="关闭详情"
          >
            &times;
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};

export default BottomSheet;
