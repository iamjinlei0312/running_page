import { useEffect, useRef, useState, type MouseEvent } from 'react';
import useActivities from '@/hooks/useActivities';
import { getYearStatSummaries } from '@/components/YearStat';
import BottomSheet from '@/components/BottomSheet';
import YearDetails from '@/components/YearDetails';
import { INFO_MESSAGE, IS_CHINESE } from '@/utils/const';
import {
  DIST_UNIT,
  M_TO_DIST,
  type Activity,
  type RunIds,
} from '@/utils/utils';
import styles from './style.module.css';

interface MobileOverviewProps {
  year: string;
  runs: Activity[];
  filterLabel: string;
  isYearFilter: boolean;
  changeYear: (_year: string) => void;
  changeCity: (_city: string) => void;
  changeTitle: (_title: string) => void;
  locateActivity: (_ids: RunIds) => void;
}

const MobileOverview = ({
  year,
  runs,
  filterLabel,
  isYearFilter,
  changeYear,
  changeCity,
  changeTitle,
  locateActivity,
}: MobileOverviewProps) => {
  const { activities, years, cities, runPeriod, countries, provinces } =
    useActivities();
  const [panel, setPanel] = useState<'year' | 'filter' | null>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const summary = getYearStatSummaries(runs).get('Total');
  const detailYear = isYearFilter ? year : 'Total';

  useEffect(() => {
    const closeOnDesktop = () => {
      if (
        overviewRef.current &&
        getComputedStyle(overviewRef.current).display === 'none'
      )
        setPanel(null);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  const handleTotalClick = (event: MouseEvent<HTMLDivElement>) => {
    const path =
      event.target instanceof Element ? event.target.closest('path') : null;
    if (!path) return;
    const runId = Number(path.querySelector('desc')?.textContent);
    const date = path
      .querySelector('title')
      ?.textContent?.match(/\d{4}-\d{1,2}-\d{1,2}/)?.[0];
    const ids = runId
      ? [runId]
      : date
        ? activities
            .filter((run) => run.start_date_local.slice(0, 10) === date)
            .map((run) => run.run_id)
        : [];
    if (!ids.length) return;
    setPanel(null);
    locateActivity(ids);
  };

  return (
    <div ref={overviewRef} className={styles.overview}>
      <div className={styles.toolbar}>
        <select
          aria-label="选择年份"
          value={detailYear}
          onChange={(event) => changeYear(event.target.value)}
        >
          {years.map((item) => (
            <option key={item} value={item}>
              {item} 年
            </option>
          ))}
          <option value="Total">全部年份</option>
        </select>
        <div className={styles.actions}>
          {IS_CHINESE && (
            <button onClick={() => setPanel('filter')}>筛选</button>
          )}
          <button onClick={() => setPanel('year')}>
            {detailYear === 'Total' ? '全部详情' : '年度详情'}
          </button>
        </div>
      </div>
      {!isYearFilter && (
        <div className={styles.activeFilter}>
          <span>当前筛选：{filterLabel}</span>
          <button onClick={() => changeYear('Total')}>清除</button>
        </div>
      )}
      <dl className={styles.metrics}>
        <div>
          <dt>距离 · {DIST_UNIT}</dt>
          <dd>{summary?.totalDistance ?? 0}</dd>
        </div>
        <div>
          <dt>跑步次数</dt>
          <dd>{summary?.runCount ?? 0}</dd>
        </div>
        <div>
          <dt>平均配速</dt>
          <dd>{runs.length ? summary?.averagePace : '—'}</dd>
        </div>
      </dl>
      <details className={styles.introduction}>
        <summary>关于我的跑步</summary>
        <p>{INFO_MESSAGE(years.length, detailYear)}</p>
        {IS_CHINESE && (
          <p>
            跑过 {countries.length} 个国家、{provinces.length} 个省、
            {Object.keys(cities).length} 个城市。
          </p>
        )}
        <p>
          “明明这么痛苦，这么难过，为什么就是不能放弃跑步？因为全身细胞都在蠢蠢欲动，想要感受强风迎面吹拂的滋味。”
          ——《强风吹拂》
        </p>
      </details>
      <BottomSheet
        isOpen={panel !== null}
        onClose={() => setPanel(null)}
        title={
          panel === 'filter'
            ? '筛选跑步记录'
            : detailYear === 'Total'
              ? '全部跑步详情'
              : `${detailYear} 年度详情`
        }
      >
        {panel === 'year' && (
          <YearDetails year={detailYear} onTotalClick={handleTotalClick} />
        )}
        {panel === 'filter' && (
          <div className={styles.filters}>
            <p className="text-run-date text-sm">
              城市和时段筛选覆盖全部年份；选择年份会清除筛选。
            </p>
            <button
              onClick={() => {
                changeYear('Total');
                setPanel(null);
              }}
            >
              查看全部记录
            </button>
            <h3>按城市</h3>
            {Object.entries(cities)
              .sort((a, b) => b[1] - a[1])
              .map(([city, distance]) => (
                <button
                  key={city}
                  aria-pressed={!isYearFilter && filterLabel === city}
                  onClick={() => {
                    changeCity(city);
                    setPanel(null);
                  }}
                >
                  <span>{city}</span>
                  <span>
                    {(distance / M_TO_DIST).toFixed(1)} {DIST_UNIT}
                  </span>
                </button>
              ))}
            <h3>按时段</h3>
            {Object.entries(runPeriod)
              .sort((a, b) => b[1] - a[1])
              .map(([period, count]) => (
                <button
                  key={period}
                  aria-pressed={!isYearFilter && filterLabel === period}
                  onClick={() => {
                    changeTitle(period);
                    setPanel(null);
                  }}
                >
                  <span>{period}</span>
                  <span>{count} 次</span>
                </button>
              ))}
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default MobileOverview;
