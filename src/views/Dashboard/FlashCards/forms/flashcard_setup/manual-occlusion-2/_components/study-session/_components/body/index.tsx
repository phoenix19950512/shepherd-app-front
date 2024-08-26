import OcclusionWorkSpace from '../../../form/_components/occlusion/_components/occlusion-workspace';
import ScoreMaker from '../score-maker';
import Skeleton from '../skeleton';

const StudySessionBody = ({
  isFetching,
  studySession,
  onItemClicked,
  sessionStarted,
  setSessionStarted,
  answered,
  setRight,
  setNotRemembered,
  setWrong
}: {
  isFetching: boolean;
  studySession: any;
  onItemClicked: (item: any) => void;
  sessionStarted: any;
  setSessionStarted: (sessionStarted: any) => void;
  answered: boolean;
  setRight: () => void;
  setNotRemembered: () => void;
  setWrong: () => void;
}) => {
  return (
    <div className="body">
      {isFetching ? (
        <Skeleton />
      ) : (
        <OcclusionWorkSpace
          imageURI={studySession?.imageUrl}
          items={studySession?.labels}
          itemClick={onItemClicked}
          studyMode={true}
          studySessionStarted={sessionStarted.started}
        />
      )}

      <ScoreMaker
        {...{ sessionStarted, answered, setRight, setNotRemembered, setWrong }}
      />
    </div>
  );
};

export default StudySessionBody;
