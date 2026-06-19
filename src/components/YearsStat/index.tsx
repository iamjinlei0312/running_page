import { useMemo, useState, useEffect, lazy } from 'react';
import YearStat, { getYearStatSummaries } from '@/components/YearStat';
import useActivities from '@/hooks/useActivities';
import { INFO_MESSAGE } from '@/utils/const';
import BottomSheet from '@/components/BottomSheet';
import { yearStats, githubYearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

const yearSvgs = Object.fromEntries(
  Object.keys(yearStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(yearStats, path)),
  ])
);

const githubYearSvgs = Object.fromEntries(
  Object.keys(githubYearStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(githubYearStats, path)),
  ])
);

const YearsStat = ({
  year,
  onClick,
}: {
  year: string;
  onClick: (_year: string) => void;
}) => {
  const { activities, years } = useActivities();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 1023px)').matches;
    }
    return false;
  });
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedYearForSheet, setSelectedYearForSheet] = useState<
    string | null
  >(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Memoize the years array calculation - stable chronological on mobile, shuffling on desktop
  const yearsArrayUpdate = useMemo(() => {
    if (isMobile) {
      return [...years, 'Total'];
    }
    // Desktop: click year card to move it to the top
    let updatedYears = years.slice();
    updatedYears.push('Total');
    updatedYears = updatedYears.filter((x) => x !== year);
    updatedYears.unshift(year);
    return updatedYears;
  }, [years, year, isMobile]);

  const infoMessage = useMemo(() => {
    return INFO_MESSAGE(years.length, year);
  }, [years.length, year]);

  const handleYearClick = (yearItem: string) => {
    onClick(yearItem);
    if (isMobile && yearItem !== 'Total') {
      setSelectedYearForSheet(yearItem);
      setBottomSheetOpen(true);
    }
  };

  // Get active summary and SVGs for BottomSheet
  const activeSummary = useMemo(() => {
    if (!selectedYearForSheet) return null;
    return getYearStatSummaries(activities).get(selectedYearForSheet) || null;
  }, [activities, selectedYearForSheet]);

  const activeYearSVG = selectedYearForSheet
    ? yearSvgs[`./year_${selectedYearForSheet}.svg`] || null
    : null;

  const activeGithubYearSVG = selectedYearForSheet
    ? githubYearSvgs[`./github_${selectedYearForSheet}.svg`] || null
    : null;

  return (
    <div className="w-full pr-16 pb-16 lg:w-full lg:pr-16">
      <section className="pb-0">
        <p className="leading-relaxed">
          {infoMessage}
          <br />
          <br />
          “明明这么痛苦，这么难过，为什么就是不能放弃跑步？因为全身细胞都在蠢蠢欲动，想要感受强风迎面吹拂的滋味。”
        </p>
        <p className="text-right">——《强风吹拂》</p>
      </section>
      <hr />
      {yearsArrayUpdate.map((yearItem) => (
        <YearStat
          key={yearItem}
          year={yearItem}
          onClick={handleYearClick}
          isSelected={yearItem === year}
          isMobile={isMobile}
        />
      ))}

      {selectedYearForSheet && activeSummary && (
        <BottomSheet
          isOpen={bottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
          year={selectedYearForSheet}
          YearSVG={activeYearSVG}
          GithubYearSVG={activeGithubYearSVG}
          summary={activeSummary}
        />
      )}
    </div>
  );
};

export default YearsStat;
