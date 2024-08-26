import { cn } from '../../../../../../../../library/utils';

function Progress() {
  return (
    <div className="w-full flex justify-between my-6 gap-2 items-center">
      <Dot active={true}/>
      <Line />
      <Dot />
      <Line />
      <Dot />
    </div>
  );
}

const Line = () => {
  return <div className="flex-1 h-[3px] bg-[#E5E5E5]"></div>;
};

const Dot = ({ active }: { active?: boolean }) => {
  return (
    <div
      className={cn(
        'w-[24px] h-[24px] rounded-full border-2 bg-[#EFF0F0] border-[#E2E3E4] flex items-center justify-center transition-colors',
        active && 'bg-[#BAD7FD] border-[#7AA7FB]'
      )}
    >
      <div
        className={cn(
          'center-dot clear-start w-[8px] h-[8px] bg-[#CDD1D5] rounded-full transition-colors',
          active && 'bg-[#207DF7]'
        )}
      ></div>
    </div>
  );
};

export default Progress;
