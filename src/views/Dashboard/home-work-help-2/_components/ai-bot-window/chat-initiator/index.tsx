import InteractiveArea from './_components/interactive-area';

function ChatInitiator({
  initiateConversation
}: {
  initiateConversation: ({
    subject,
    topic
  }: {
    subject: string;
    topic: string;
  }) => void;
}) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <InteractiveArea initiateConversation={initiateConversation} />
    </div>
  );
}

export default ChatInitiator;
