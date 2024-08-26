import StudySessionControls from '../controls';
import StudySessionTitle from '../title';

const StudySessionHeader = ({
  studySession,
  sessionStarted,
  setSessionStarted,
  isSubmittingQuiz,
  isFetching,
  setQuizOver,
  resetForm,
  numberOfBubbledChecked,
  close,
  setOpenResults
}) => {
  return (
    <header className="p-4 border-b flex items-center justify-between">
      <StudySessionTitle studySession={studySession} isLoading={isFetching} />
      <StudySessionControls
        {...{
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
        }}
      />
    </header>
  );
};

export default StudySessionHeader;
