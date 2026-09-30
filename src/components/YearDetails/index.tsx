import { lazy, Suspense, type MouseEventHandler } from 'react';
import { yearStats, githubYearStats, yearSummaryStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';
import { getYearStatSummaries } from '@/components/YearStat';
import SVGStat from '@/components/SVGStat';
import useActivities from '@/hooks/useActivities';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';
import { DIST_UNIT } from '@/utils/utils';

const yearSvgs = Object.fromEntries(
  Object.keys(yearStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(yearStats, path)),
  ])
);
const githubSvgs = Object.fromEntries(
  Object.keys(githubYearStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(githubYearStats, path)),
  ])
);
const summarySvgs = Object.fromEntries(
  Object.keys(yearSummaryStats).map((path) => [
    path,
    lazy(() => loadSvgComponent(yearSummaryStats, path)),
  ])
);

const YearDetails = ({
  year,
  onTotalClick,
}: {
  year: string;
  onTotalClick?: MouseEventHandler<HTMLDivElement>;
}) => {
  const { activities } = useActivities();
  const summary = getYearStatSummaries(activities).get(year);
  if (!summary) return null;
  const YearSvg = yearSvgs[`./year_${year}.svg`];
  const GithubSvg = githubSvgs[`./github_${year}.svg`];
  const SummarySvg = summarySvgs[`./year_summary_${year}.svg`];
  const metrics = [
    ['跑步次数', summary.runCount],
    [`距离 · ${DIST_UNIT}`, summary.totalDistance],
    ['平均配速', summary.averagePace],
    ['连续跑步 · 天', summary.streak],
    ...(summary.hasHeartRate
      ? [['平均心率 · BPM', summary.averageHeartRate]]
      : []),
    ...(SHOW_ELEVATION_GAIN ? [['累计爬升', summary.totalElevationGain]] : []),
  ];
  return (
    <div className="min-w-0">
      <dl className="grid grid-cols-2 gap-3">
        {metrics.map(([label, value]) => (
          <div
            key={label}
            className="bg-run-row-hover-background min-w-0 rounded-xl p-3"
          >
            <dt className="text-run-date mb-1 text-xs">{label}</dt>
            <dd className="font-mono text-xl font-bold wrap-anywhere">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <Suspense fallback={<p className="py-6 text-center">加载中...</p>}>
        {year === 'Total' ? (
          <SVGStat id="mobile-svg-stat" onClick={onTotalClick} />
        ) : (
          <div className="mt-6 flex flex-col items-center gap-6">
            {SummarySvg && <SummarySvg className="h-auto w-full" />}
            {YearSvg && <YearSvg className="h-auto w-4/5" />}
            {GithubSvg && (
              <div
                className="w-full overflow-x-auto"
                tabIndex={0}
                aria-label="年度跑步日历，可横向滚动"
              >
                <GithubSvg className="h-auto w-full min-w-150" />
              </div>
            )}
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default YearDetails;
