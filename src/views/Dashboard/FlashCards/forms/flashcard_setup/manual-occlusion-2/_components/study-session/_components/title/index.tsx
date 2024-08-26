const StudySessionTitle = ({ studySession, isLoading }) => {
  return (
    <div className="left flex items-center gap-2">
      <h4 className="text-[#212224] text-lg">Study Session</h4>
      {isLoading ? (
        <div className="w-20 h-6 bg-[#F4F5F6] rounded animate-pulse" />
      ) : (
        <p className="bg-[#F4F5F6] text-[#585F68] text-xs p-1.5 rounded">
          {studySession?.title}
        </p>
      )}
    </div>
  );
};

export default StudySessionTitle;
