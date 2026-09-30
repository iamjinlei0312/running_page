import React, { useState, useMemo, useCallback } from 'react';
import {
  sortDateFunc,
  sortDateFuncReverse,
  convertMovingTime2Sec,
  Activity,
  RunIds,
} from '@/utils/utils';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';
import { DIST_UNIT } from '@/utils/utils';

import RunRow from './RunRow';
import RunCard from './RunCard';
import styles from './style.module.css';

interface IRunTableProperties {
  runs: Activity[];
  locateActivity: (_runIds: RunIds) => void;
  runIndex: number;
  setRunIndex: (_index: number) => void;
}

type SortFunc = (_a: Activity, _b: Activity) => number;
type SortDirection = 'ascending' | 'descending';

interface SortState {
  direction: SortDirection;
  key: string;
}

const RunTable = ({
  runs,
  locateActivity,
  runIndex,
  setRunIndex,
}: IRunTableProperties) => {
  const [sortState, setSortState] = useState<SortState | null>(null);

  const sortKeys = useMemo(() => {
    const keys = [DIST_UNIT, 'Elev', 'Pace', 'BPM', 'Time', 'Date'];
    return SHOW_ELEVATION_GAIN ? keys : keys.filter((key) => key !== 'Elev');
  }, []);

  const getSortFunction = useCallback(
    (key: string, direction: SortDirection): SortFunc | undefined => {
      const multiplier = direction === 'ascending' ? 1 : -1;

      if (key === DIST_UNIT) {
        return (a, b) => (a.distance - b.distance) * multiplier;
      }
      if (key === 'Elev') {
        return (a, b) =>
          ((a.elevation_gain ?? 0) - (b.elevation_gain ?? 0)) * multiplier;
      }
      if (key === 'Pace') {
        return (a, b) => (a.average_speed - b.average_speed) * multiplier;
      }
      if (key === 'BPM') {
        return (a, b) =>
          ((a.average_heartrate ?? 0) - (b.average_heartrate ?? 0)) *
          multiplier;
      }
      if (key === 'Time') {
        return (a, b) =>
          (convertMovingTime2Sec(a.moving_time) -
            convertMovingTime2Sec(b.moving_time)) *
          multiplier;
      }
      if (key === 'Date') {
        return direction === 'ascending' ? sortDateFuncReverse : sortDateFunc;
      }

      return undefined;
    },
    []
  );

  const displayedRuns = useMemo(() => {
    if (!sortState) return runs;

    const sortFunction = getSortFunction(sortState.key, sortState.direction);
    if (!sortFunction) return runs;

    return runs.slice().sort(sortFunction);
  }, [getSortFunction, runs, sortState]);

  const runIndexById = useMemo(
    () => new Map(runs.map((run, index) => [run.run_id, index])),
    [runs]
  );

  const handleClick = useCallback(
    (key: string) => {
      setRunIndex(-1);
      setSortState((currentState) => {
        const initialDirection = key === 'Date' ? 'ascending' : 'descending';
        const nextDirection =
          currentState?.key === key && currentState.direction === 'descending'
            ? 'ascending'
            : initialDirection;

        return { key, direction: nextDirection };
      });
    },
    [setRunIndex]
  );

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.mobileToolbar}>
        <h2>
          跑步记录{' '}
          <span className="text-run-date">({displayedRuns.length})</span>
        </h2>
        <select
          aria-label="记录排序"
          value={
            sortState
              ? `${sortState.key}:${sortState.direction}`
              : 'Date:descending'
          }
          onChange={(event) => {
            const [key, direction] = event.target.value.split(':');
            setRunIndex(-1);
            setSortState({ key, direction: direction as SortDirection });
          }}
        >
          <option value="Date:descending">日期：最新优先</option>
          <option value="Date:ascending">日期：最早优先</option>
          <option value={`${DIST_UNIT}:descending`}>距离：长到短</option>
          <option value={`${DIST_UNIT}:ascending`}>距离：短到长</option>
          <option value="Pace:descending">配速：快到慢</option>
          <option value="Pace:ascending">配速：慢到快</option>
          <option value="Time:descending">时间：长到短</option>
          <option value="Time:ascending">时间：短到长</option>
          <option value="BPM:descending">心率：高到低</option>
          <option value="BPM:ascending">心率：低到高</option>
          {SHOW_ELEVATION_GAIN && (
            <option value="Elev:descending">爬升：高到低</option>
          )}
          {SHOW_ELEVATION_GAIN && (
            <option value="Elev:ascending">爬升：低到高</option>
          )}
        </select>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.runTable} cellSpacing="0" cellPadding="0">
          <thead>
            <tr>
              <th />
              {sortKeys.map((k) => (
                <th
                  key={k}
                  aria-sort={
                    sortState?.key === k ? sortState.direction : undefined
                  }
                  className={styles.sortableHeader}
                  onClick={() => handleClick(k)}
                >
                  {k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRuns.map((run) => {
              const sourceIndex = runIndexById.get(run.run_id) ?? -1;
              return (
                <RunRow
                  key={run.run_id}
                  elementIndex={sourceIndex}
                  locateActivity={locateActivity}
                  run={run}
                  runIndex={runIndex}
                  setRunIndex={setRunIndex}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.mobileList}>
        {displayedRuns.map((run) => {
          const sourceIndex = runIndexById.get(run.run_id) ?? -1;
          return (
            <RunCard
              key={run.run_id}
              elementIndex={sourceIndex}
              locateActivity={locateActivity}
              run={run}
              runIndex={runIndex}
              setRunIndex={setRunIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RunTable;
