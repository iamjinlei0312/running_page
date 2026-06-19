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

  return (
    <div
      className={`${styles.overlay} ${animate ? styles.overlayActive : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.sheet} ${animate ? styles.sheetActive : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header} onClick={onClose}>
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
