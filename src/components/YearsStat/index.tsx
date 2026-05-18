import YearStat from '@/components/YearStat';
import useActivities from '@/hooks/useActivities';
import { INFO_MESSAGE } from '@/utils/const';

const YearsStat = ({
  year,
  onClick,
}: {
  year: string;
  onClick: (_year: string) => void;
}) => {
  const { years } = useActivities();
  // make sure the year click on front
  let yearsArrayUpdate = years.slice();
  yearsArrayUpdate.push('Total');
  yearsArrayUpdate = yearsArrayUpdate.filter((x) => x !== year);
  yearsArrayUpdate.unshift(year);

  return (
    <div className="w-full pb-16 lg:w-full lg:pr-16">
      <section className="pb-0">
        <p className="leading-relaxed">
          {INFO_MESSAGE(years.length, year)}
          <br />
          <br />
          “明明这么痛苦，这么难过，为什么就是不能放弃跑步？因为全身细胞都在蠢蠢欲动，想要感受强风迎面吹拂的滋味。”
        </p>
        <p className="text-right">
          ——《强风吹拂》
        </p>
      </section>
      <hr />
      {yearsArrayUpdate.map((year) => (
        <YearStat key={year} year={year} onClick={onClick} />
      ))}
      {
        // eslint-disable-next-line no-prototype-builtins
        yearsArrayUpdate.hasOwnProperty('Total') ? (
          <YearStat key="Total" year="Total" onClick={onClick} />
        ) : (
          <div />
        )
      }
    </div>
  );
};

export default YearsStat;
