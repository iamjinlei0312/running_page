import YearStat from '@/components/YearStat';
import {
  CHINESE_LOCATION_INFO_MESSAGE_FIRST,
  CHINESE_LOCATION_INFO_MESSAGE_SECOND,
<<<<<<< HEAD:src/components/LocationStat/index.jsx
} from 'src/utils/const';
=======
} from '@/utils/const';
>>>>>>> upstream/master:src/components/LocationStat/index.tsx
import CitiesStat from './CitiesStat';
import LocationSummary from './LocationSummary';
import PeriodStat from './PeriodStat';

<<<<<<< HEAD:src/components/LocationStat/index.jsx
const LocationStat = ({ changeYear, changeCity, changeTitle }) => (
  <div className="w-100 w-100-l pb5 pr5-l">
=======
interface ILocationStatProps {
  changeYear: (_year: string) => void;
  changeCity: (_city: string) => void;
  changeTitle: (_title: string) => void;
}

const LocationStat = ({ changeYear, changeCity, changeTitle }: ILocationStatProps) => (
  <div className="fl w-100 w-100-l pb5 pr5-l">
>>>>>>> upstream/master:src/components/LocationStat/index.tsx
    <section className="pb4" style={{ paddingBottom: '0rem' }}>
      <p style={{ lineHeight: 1.8 }}>
        {CHINESE_LOCATION_INFO_MESSAGE_FIRST}
        .
        <br />
        {CHINESE_LOCATION_INFO_MESSAGE_SECOND}
        .
        <br />
        <br />
        Yesterday you said tomorrow.
      </p>
    </section>
    <hr color="red" />
    <LocationSummary />
    <CitiesStat onClick={changeCity} />
    <PeriodStat onClick={changeTitle} />
    <YearStat year="Total" onClick={changeYear} />
  </div>
);

export default LocationStat;
