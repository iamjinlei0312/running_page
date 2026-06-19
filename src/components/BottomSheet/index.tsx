import React, { useEffect, useState, Suspense } from 'react';
import styles from './style.module.css';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  year: string;
  YearSVG: React.LazyExoticComponent<any> | null;
  GithubYearSVG: React.LazyExoticComponent<any> | null;
  summary: any;
}

const BottomSheet = ({
  isOpen,
  onClose,
  year,
  YearSVG,
  GithubYearSVG,
  summary,
}: BottomSheetProps) => {
  const [animate, setAnimate] = useState(false);

  // Touch gesture state for dragging down to close
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => {
      cancelAnimationFrame(frame);
      setAnimate(false);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    // Only allow dragging downwards (positive deltaY)
    if (deltaY > 0) {
      setCurrentY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If dragged down past 100px, trigger close. Otherwise bounce back.
    if (currentY > 100) {
      onClose();
    }
    setCurrentY(0);
  };

  // Inline style for dynamic dragging transform
  const transformStyle =
    isDragging || currentY > 0
      ? {
          transform: `translateY(${currentY}px)`,
          transition: 'none', // Disable transition during drag for 1:1 responsiveness
        }
      : undefined;

  return (
    <div
      className={`${styles.overlay} ${animate ? styles.overlayActive : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.sheet} ${animate ? styles.sheetActive : ''}`}
        style={transformStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={styles.header}
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.handle} />
        </div>
        <div className={styles.content}>
          <div className={styles.statsHeader}>
            <span className={styles.yearTitle}>{year} Journey</span>
            <button className={styles.closeBtn} onClick={onClose}>
              &times;
            </button>
          </div>
          <div className={styles.statsSummary}>
            <div className={styles.statBox}>
              <span className={styles.statVal}>{summary.runCount}</span>
              <span className={styles.statLbl}>Runs</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statVal}>{summary.totalDistance}</span>
              <span className={styles.statLbl}>KM</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statVal}>{summary.averagePace}</span>
              <span className={styles.statLbl}>Avg Pace</span>
            </div>
          </div>
          <div className={styles.chartsContainer}>
            <Suspense
              fallback={<div className={styles.loading}>加载中...</div>}
            >
              {YearSVG && <YearSVG className={styles.chartSvg} />}
              {GithubYearSVG && <GithubYearSVG className={styles.githubSvg} />}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
