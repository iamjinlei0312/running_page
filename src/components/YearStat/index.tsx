import React, { lazy, Suspense, useState } from 'react';
import YearSummaryModal from '@/components/YearSummaryModal';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace, Activity } from '@/utils/utils';
import useHover from '@/hooks/useHover';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';

const yearSvgs: Record<string, React.LazyExoticComponent<any>> = Object.fromEntries(
  Object.keys(yearStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(yearStats, path)),
  ])
);

interface YearStatAccumulator {
  averageHeartRateTotal: number;
  heartRateNullCount: number;
  runCount: number;
  streak: number;
  totalDistance: number;
  totalElevationGain: number;
  totalMetersForPace: number;
  totalSecondsForPace: number;
}

interface YearStatSummary {
  averageHeartRate: string;
  averagePace: string;
  hasHeartRate: boolean;
  runCount: number;
  streak: number;
  totalDistance: number;
  totalElevationGain: string;
}

const createAccumulator = (): YearStatAccumulator => ({
  averageHeartRateTotal: 0,
  heartRateNullCount: 0,
  runCount: 0,
  streak: 0,
  totalDistance: 0,
  totalElevationGain: 0,
  totalMetersForPace: 0,
  totalSecondsForPace: 0,
});

const addRunToAccumulator = (
  accumulator: YearStatAccumulator,
  run: Activity
) => {
  accumulator.runCount += 1;
  accumulator.totalDistance += run.distance || 0;
  accumulator.totalElevationGain += run.elevation_gain || 0;

  if (run.average_speed) {
    accumulator.totalMetersForPace += run.distance || 0;
    accumulator.totalSecondsForPace += (run.distance || 0) / run.average_speed;
  }

  if (run.average_heartrate) {
    accumulator.averageHeartRateTotal += run.average_heartrate;
  } else {
    accumulator.heartRateNullCount += 1;
  }

  if (run.streak) {
    accumulator.streak = Math.max(accumulator.streak, run.streak);
  }
};

const finalizeYearStat = (
  accumulator: YearStatAccumulator
): YearStatSummary => {
  const heartRateCount = accumulator.runCount - accumulator.heartRateNullCount;

  return {
    averageHeartRate: (
      accumulator.averageHeartRateTotal / heartRateCount
    ).toFixed(0),
    averagePace: formatPace(
      accumulator.totalMetersForPace / accumulator.totalSecondsForPace
    ),
    hasHeartRate: accumulator.averageHeartRateTotal !== 0,
    runCount: accumulator.runCount,
    streak: accumulator.streak,
    totalDistance: parseFloat(
      (accumulator.totalDistance / 1000.0).toFixed(1)
    ),
    totalElevationGain: accumulator.totalElevationGain.toFixed(0),
  };
};

const yearStatCache = new WeakMap<Activity[], Map<string, YearStatSummary>>();

const getYearStatSummaries = (activityData: Activity[]) => {
  const cachedSummaries = yearStatCache.get(activityData);
  if (cachedSummaries) return cachedSummaries;

  const accumulators = new Map<string, YearStatAccumulator>();
  accumulators.set('Total', createAccumulator());

  activityData.forEach((run) => {
    const year = run.start_date_local.slice(0, 4);
    if (!accumulators.has(year)) {
      accumulators.set(year, createAccumulator());
    }
    addRunToAccumulator(accumulators.get('Total')!, run);
    addRunToAccumulator(accumulators.get(year)!, run);
  });

  const summaries = new Map(
    Array.from(accumulators, ([year, accumulator]) => [
      year,
      finalizeYearStat(accumulator),
    ])
  );
  yearStatCache.set(activityData, summaries);
  return summaries;
};

const YearStat = ({
  year,
  onClick,
}: {
  year: string;
  onClick: (_year: string) => void;
}) => {
  const { activities: runs } = useActivities();
  // for hover
  const [hovered, eventHandlers] = useHover();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const YearSVG = yearSvgs[`./year_${year}.svg`];
  const summary = getYearStatSummaries(runs).get(year);

  if (!summary) return null;


  return (
    <div
      className="cursor-pointer px-4 py-3 -mx-4 rounded-xl border border-transparent transition-all duration-300 ease-in-out hover:bg-black/5 hover:border-black/5 dark:hover:bg-white/5 dark:hover:border-white/5"
      onClick={() => onClick(year)}
      {...eventHandlers}
    >
      <section className="relative">
        {year !== 'Total' && (
          <button 
            className="absolute right-0 top-2 z-10 mr-2 rounded bg-gray-800/50 px-2 py-1 text-xs font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white lg:mr-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            Summary Modal
          </button>
        )}
        <Stat value={year} description=" Journey" />
        <Stat value={summary.runCount} description=" Runs" />
        <Stat value={summary.totalDistance} description=" KM" />
        {SHOW_ELEVATION_GAIN && (
          <Stat value={summary.totalElevationGain} description=" Elevation Gain" />
        )}
        <Stat value={summary.averagePace} description=" Avg Pace" />
        <Stat value={`${summary.streak} day`} description=" Streak" />
        {summary.hasHeartRate && (
          <Stat value={summary.averageHeartRate} description=" Avg Heart Rate" />
        )}
      </section>
      {year !== 'Total' && YearSVG && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            hovered ? 'max-h-96 opacity-100 mt-2 mb-4' : 'max-h-0 opacity-0 mt-0 mb-0'
          }`}
        >
          <Suspense fallback={<div className="text-xs text-gray-500 animate-pulse">loading...</div>}>
            <YearSVG className="h-4/6 w-4/6 border-0 p-0" />
          </Suspense>
        </div>
      )}
      <hr />
      {isModalOpen && <YearSummaryModal year={year} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default YearStat;
