import {
  formatPace,
  titleForRun,
  formatRunTime,
  Activity,
  RunIds,
  M_TO_DIST,
} from '@/utils/utils';
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
  const isSelected = runIndex === elementIndex;

  const paceParts = run.average_speed ? formatPace(run.average_speed) : null;
  const heartRate = run.average_heartrate;
  const runTime = formatRunTime(run.moving_time);

  const handleClick = () => {
    if (isSelected) {
      setRunIndex(-1);
      locateActivity([]);
      return;
    }
    setRunIndex(elementIndex);
    locateActivity([run.run_id]);
  };

  // Format date to YYYY/MM/DD
  const formattedDate = run.start_date_local
    ? run.start_date_local.slice(0, 10).replace(/-/g, '/')
    : '';

  return (
    <div
      className={`${styles.runCard} ${isSelected ? styles.selectedCard : ''}`}
      onClick={handleClick}
    >
      <div className={styles.cardMain}>
        <div className={styles.cardLeft}>
          <div className={styles.runIconWrapper}>
            <svg
              className={styles.runIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7-.9 4.7-2.9-1.2-.7 1.9 3.7 1.5z" />
            </svg>
          </div>
        </div>
        <div className={styles.cardMiddle}>
          <span className={styles.cardTitle}>{titleForRun(run)}</span>
          <span className={styles.cardDistance}>
            {distance} <span className={styles.cardUnit}>km</span>
          </span>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.cardDeviceIcons}>
            <span className={styles.deviceIcon}>👟</span>
            <span className={styles.deviceIcon}>⌚</span>
          </div>
          <span className={styles.cardDate}>{formattedDate}</span>
        </div>
      </div>
      {(paceParts || heartRate || runTime) && (
        <div className={styles.cardStats}>
          {paceParts && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Pace</span>
              <span className={styles.statValue}>{paceParts}</span>
            </div>
          )}
          {heartRate && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>BPM</span>
              <span className={styles.statValue}>{heartRate.toFixed(0)}</span>
            </div>
          )}
          {runTime && (
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Time</span>
              <span className={styles.statValue}>{runTime}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RunCard;
