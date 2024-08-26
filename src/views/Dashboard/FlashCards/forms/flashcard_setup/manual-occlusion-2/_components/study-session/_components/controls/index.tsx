import CloseButton from '../close';
import StartStopButton from '../start-stop-button';

const StudySessionControls = ({
  isSubmittingQuiz,
  isFetching,
  sessionStarted,
  setSessionStarted,
  studySession,
  setQuizOver,
  numberOfBubbledChecked,
  resetForm,
  close,
  setOpenResults
}) => {
  return (
    <div className="right flex items-center gap-3">
      <StartStopButton
        {...{
          isSubmittingQuiz,
          isFetching,
          sessionStarted,
          setSessionStarted,
          studySession,
          setQuizOver,
          numberOfBubbledChecked
        }}
      />
      <CloseButton
        {...{
          setOpenResults,
          setQuizOver,
          resetForm,
          close
        }}
      />
    </div>
  );
};

export default StudySessionControls;
