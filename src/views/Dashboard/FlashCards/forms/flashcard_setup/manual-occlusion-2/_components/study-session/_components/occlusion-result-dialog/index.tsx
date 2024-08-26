import { useEffect, useState } from 'react';
import { Button } from '../../../../../../../../../../components/ui/button';
import {
  Dialog,
  DialogContent
} from '../../../../../../../../../../components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../../../../../../../../../services/ApiService';
import { ReloadIcon } from '@radix-ui/react-icons';
import { cn } from '../../../../../../../../../../library/utils';

interface Score {
  right: number;
  wrong: number;
  notRemembered: number;
}

interface Props {
  open: boolean;
  close: () => void;
  score: Score;
  restartStudySession: () => void;
  id: string;
  handleEditImage: () => void;
  editImageDisabled?: boolean;
}

function calculatePercentage(score: Score) {
  const total = score.notRemembered + score.right + score.wrong;
  return {
    notRemembered: Math.floor((score.notRemembered / total) * 100),
    wrong: Math.floor((score.wrong / total) * 100),
    right: Math.floor((score.right / total) * 100)
  };
}

const OccResultsDialog: React.FC<Props> = ({
  id,
  open,
  close,
  score,
  restartStudySession,
  handleEditImage,
  editImageDisabled = false
}) => {
  const queryClient = useQueryClient();
  const [currentScore, setCurrentScore] = useState(calculatePercentage(score));
  const { mutate, isPending } = useMutation({
    mutationFn: (occId: string) =>
      ApiService.resetOcclusionCard(occId).then((res) => res.json())
  });

  useEffect(() => {
    setCurrentScore(calculatePercentage(score));
  }, [open, score]);

  const { notRemembered, right, wrong } = currentScore;

  const handleRestart = () => {
    if (id) {
      mutate(id, {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['occlusion-card', id]
          });
          setTimeout(() => {
            restartStudySession();
          }, 100);
        }
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="bg-white w-[740px] h-[495px] p-0 flex flex-col items-stretch gap-0 max-w-none overflow-visible">
        <Button
          onClick={close}
          className="absolute w-[30px] h-[30px] flex justify-center items-center bg-white rounded-full right-[-2.5rem] top-[-2.5rem] overflow-hidden"
        >
          <p className="text-[#5C5F64] font-light text-[1.6em] pb-[4px]">
            &times;
          </p>
        </Button>
        <div className="bg-[#E1EEFE] h-[197px] rounded-lg"></div>
        <div className="flex-1 w-full bg-[#F6F6F9] flex flex-col gap-2 text-center p-6">
          <div className="h-[71px] flex flex-col justify-between">
            <h4 className="text-2xl font-semibold">Congratulations!</h4>
            <p className="text-[#6E7682] text-[16px]">
              You reviewed the occlusion card, what will you like to do next?
            </p>
          </div>
          {/* Score */}
          <div className="flex justify-between w-[476px] mx-auto">
            {/* Score details */}
            <ScoreDetail color="#4CAF50" label="Got it right" score={right} />
            <ScoreDetail
              color="#FB8441"
              label="Didn't remember"
              score={notRemembered}
            />
            <ScoreDetail color="red" label="Got it wrong" score={wrong} />
          </div>
          {/* Button */}
          <div className="flex w-[628px] mx-auto justify-between mt-8">
            <Button
              className="w-[304px] h-[42px] bg-white text-[#5C5F64] text-sm font-medium"
              disabled={isPending}
              onClick={handleRestart}
            >
              {isPending ? (
                <ReloadIcon className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Restart Flashcard
            </Button>
            <Button
              className={cn(
                'w-[304px] h-[42px] bg-white text-[#5C5F64] text-sm font-medium',
                editImageDisabled ? 'opacity-50 cursor-not-allowed' : ''
              )}
              onClick={handleEditImage}
            >
              Edit Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ScoreDetail: React.FC<{
  color: string;
  label: string;
  score: number;
}> = ({ color, label, score }) => (
  <div className="flex gap-2 mx-auto mt-6 items-center">
    <div className="w-[12px] h-[12px]" style={{ backgroundColor: color }} />
    <span className="text-[#585F68] text-xs font-normal">{label}</span>
    <span className="text-[#585F68] ml-1 text-xs font-semibold">
      {score || 0}%
    </span>
  </div>
);

export default OccResultsDialog;
