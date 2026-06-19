import {
  formatPace,
  titleForRun,
  formatRunTime,
  Activity,
  RunIds,
} from '@/utils/utils';
import { SHOW_ELEVATION_GAIN } from '@/utils/const';
import { M_TO_DIST, M_TO_ELEV } from '@/utils/utils';
import styles from './style.module.css';

interface IRunCardProperties {
  elementIndex: number;
  locateActivity: (_runIds: RunIds) => void;
  run: Activity;
  runIndex: number;
  setRunIndex: (_index: number) => void;
}

const RunCard = ({
  elementIndex,
  locateActivity,
  run,
  runIndex,
  setRunIndex,
}: IRunCardProperties) => {
  const distance = (run.distance / M_TO_DIST).toFixed(2);
  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate;
  const runTime = formatRunTime(run.moving_time);
  const isSelected = runIndex === elementIndex;

  const handleClick = () => {
    if (isSelected) {
      setRunIndex(-1);
      locateActivity([]);
      return;
    }
    setRunIndex(elementIndex);
    locateActivity([run.run_id]);
  };

  return (
    <div
      className={`${styles.runCard} ${isSelected ? styles.selectedCard : ''}`}
      onClick={handleClick}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{titleForRun(run)}</span>
        <span className={styles.cardDate}>{run.start_date_local}</span>
      </div>
      <div className={styles.cardMetrics}>
        <div className={styles.metricItem}>
          <span className={styles.metricValue}>{distance}</span>
          <span className={styles.metricLabel}>KM</span>
        </div>
        {paceParts && (
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>{paceParts}</span>
            <span className={styles.metricLabel}>配速</span>
          </div>
        )}
        <div className={styles.metricItem}>
          <span className={styles.metricValue}>{runTime}</span>
          <span className={styles.metricLabel}>用时</span>
        </div>
        {heartRate && (
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>{heartRate.toFixed(0)}</span>
            <span className={styles.metricLabel}>BPM</span>
          </div>
        )}
        {SHOW_ELEVATION_GAIN && (
          <div className={styles.metricItem}>
            <span className={styles.metricValue}>
              {((run.elevation_gain ?? 0) * M_TO_ELEV).toFixed(1)}
            </span>
            <span className={styles.metricLabel}>爬升</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunCard;
