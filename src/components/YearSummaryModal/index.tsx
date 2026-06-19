import { lazy, Suspense, useEffect, useState } from 'react';
import { yearSummaryStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import styles from './style.module.css';

interface YearSummaryModalProps {
  year: string;
  onClose: () => void;
}

const yearSummarySvgs = Object.fromEntries(
  Object.keys(yearSummaryStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(yearSummaryStats, path)),
  ])
);

const YearSummaryModal = ({ year, onClose }: YearSummaryModalProps) => {
  const [mounted, setMounted] = useState(false);
  const YearSummarySVG = yearSummarySvgs[`./year_summary_${year}.svg`];

  // Trigger animation after mount
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className={`${styles.overlay} transition-opacity duration-300 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`} 
      onClick={onClose}
    >
      <div 
        className={`${styles.modal} transition-all duration-300 ease-out ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        {YearSummarySVG && (
          <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <YearSummarySVG className={styles.svg} />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default YearSummaryModal;
