import { intComma } from '@/utils/utils';

interface IStatProperties {
  value: string | number;
  description: string;
  className?: string;
  citySize?: number;
  onClick?: () => void;
}

const Stat = ({
  value,
  description,
  className = 'pb-2 w-full',
  citySize,
  onClick,
}: IStatProperties) => {
  const textClass = citySize === 3 ? 'text-3xl' : 'text-5xl';
  const mobileTextClass = citySize === 3 ? 'text-xl' : 'text-3xl';
  return (
    <div className={`${className}`} onClick={onClick}>
      <span className={`${mobileTextClass} lg:${textClass} font-bold italic`}>
        {intComma(value.toString())}
      </span>
      <span className="text-sm font-semibold italic lg:text-lg">
        {description}
      </span>
    </div>
  );
};

export default Stat;
