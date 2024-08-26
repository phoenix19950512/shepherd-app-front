import { cn } from '../../../../../../../../../../library/utils';
import SVGCheck from '../icons/check';
import SVGCross from '../icons/cross';
import SVGQuestion from '../icons/question';
import ScoreButton from '../score-button';

const ScoreMaker = ({
  sessionStarted,
  answered,
  setRight,
  setNotRemembered,
  setWrong
}: {
  sessionStarted: any;
  answered: boolean;
  setRight: () => void;
  setNotRemembered: () => void;
  setWrong: () => void;
}) => {
  return (
    <div
      className={cn(
        'score-maker flex justify-between p-4 transition-opacity',
        !sessionStarted.started
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100 pointer-events-auto'
      )}
    >
      <ScoreButton
        disabled={!answered}
        onClick={setRight}
        icon={<SVGCheck />}
        text="Got it right"
        className="bg-[#EDF7EE] text-[#4CAF50] w-[217px] h-[54px] text-[16px] font-medium"
      />
      <ScoreButton
        disabled={!answered}
        onClick={setNotRemembered}
        icon={<SVGQuestion />}
        text="Didn't remember"
        className="bg-[#FFEFE6] text-[#FB8441] w-[217px] h-[54px] text-[16px] font-medium"
      />
      <ScoreButton
        disabled={!answered}
        onClick={setWrong}
        icon={<SVGCross />}
        text="Got it wrong"
        className="bg-[#FEECEC] text-[#F53535] w-[217px] h-[54px] text-[16px] font-medium"
      />
    </div>
  );
};

export default ScoreMaker;
