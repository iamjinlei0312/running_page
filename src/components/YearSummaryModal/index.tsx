import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { yearSummaryStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

interface YearSummaryModalProps {
  year: string;
  onClose: () => void;
}

const YearSummaryModal = ({ year, onClose }: YearSummaryModalProps) => {
  const [mounted, setMounted] = useState(false);

  // Memoize the lazy component to prevent re-creation on each render
  const YearSummarySVG = useMemo(
    () =>
      lazy(() =>
        loadSvgComponent(yearSummaryStats, `./year_summary_${year}.svg`)
      ),
    [year]
  );

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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        mounted ? 'opacity-100' : 'opacity-0'
      }`} 
      onClick={onClose}
    >
      <div 
        className={`relative flex h-full w-full items-center justify-center transition-all duration-300 ease-out ${
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`} 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-6 right-8 z-10 text-5xl font-light text-gray-400 transition-colors hover:text-white" 
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <Suspense fallback={<div className="p-10 text-center text-gray-400 animate-pulse">Loading Summary...</div>}>
          <YearSummarySVG className="h-[90vh] w-auto max-w-[95vw] block" />
        </Suspense>
      </div>
    </div>
  );
};

export default YearSummaryModal;
