import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../../../../../../../../../../components/ui/button";
import { cn } from "../../../../../../../../../../library/utils";

const StartStopButton = ({
  isSubmittingQuiz,
  isFetching,
  sessionStarted,
  setSessionStarted,
  studySession,
  setQuizOver,
  numberOfBubbledChecked
}) => {
  return (
    <div>
      <Button
        disabled={isSubmittingQuiz || isFetching}
        className={sessionStarted.started ? 'bg-[red] text-[white]' : ''}
        onClick={() => {
          if (sessionStarted.started) {
            setQuizOver(true);
            // setScore({ right: 0, wrong: 0, notRemembered: 0 });
            return;
          }
          setSessionStarted({ started: true, data: studySession });
        }}
      >
        <span
          className={cn('inline-block mr-2', {
            hidden: sessionStarted.started
          })}
        >
          <svg
            width="14"
            height="20"
            viewBox="0 0 14 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.8335 8.33334H13.6668L6.16683 19.1667V11.6667H0.333496L7.8335 0.833344V8.33334Z"
              fill="white"
            />
          </svg>
        </span>
        {sessionStarted.started && (
          <span className="inline-flex mr-2 rounded-full w-5 h-5 bg-white/50 items-center justify-center">
            {isSubmittingQuiz ? (
              <ReloadIcon className="animate-spin" />
            ) : (
              numberOfBubbledChecked
            )}
          </span>
        )}
        <span>{sessionStarted.started ? 'Stop' : 'Start'}</span>
      </Button>
    </div>
  );
};

export default StartStopButton;
