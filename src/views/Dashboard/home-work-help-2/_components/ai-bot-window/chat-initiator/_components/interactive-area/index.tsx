import Input from './_components/input';
import { useState } from 'react';
import WelcomeBackText from './_components/welcome-text';
import RecentConversations from './_components/recent-conversations';
import { languages } from '../../../../../../../../helpers';
type Language = (typeof languages)[number] | '';
function InteractiveArea({
  initiateConversation
}: {
  initiateConversation: ({
    subject,
    topic,
    level,
    language,
    topicSecondary
  }: {
    subject: string;
    topic: string;
    level: string;
    language: Language;
    topicSecondary?: string;
  }) => void;
}) {
  const [chatContext, setChatContext] = useState<{
    subject: string;
    topic: string;
    level: string;
    language: Language;
    topicSecondary?: string;
  }>({
    subject: '',
    topic: '',
    level: '',
    language: '',
    topicSecondary: ''
  });

  const handleSubjectChange = (subject: string) => {
    setChatContext((prev) => ({ ...prev, subject }));
  };

  const handleTopicChange = (topic: string) => {
    setChatContext((prev) => ({ ...prev, topic }));
  };

  const handleLevelChange = (level: string) => {
    setChatContext((prev) => ({ ...prev, level }));
  };
  const handleLanguageChange = (language: Language) => {
    setChatContext((prev) => ({ ...prev, language }));
  };

  const handleTopicSecondaryChange = (topicSecondary: string) => {
    setChatContext((prev) => ({ ...prev, topicSecondary }));
  };

  const handleSubmit = () => {
    initiateConversation(chatContext);
  };

  return (
    <div className="w-[80%] mx-auto max-w-[600px] mb-24 relative">
      <WelcomeBackText />
      <Input
        actions={{
          handleSubjectChange,
          handleTopicChange,
          onSubmit: handleSubmit,
          handleLevelChange,
          handleLanguageChange,
          handleTopicSecondaryChange
        }}
        state={{ chatContext }}
      />
      <RecentConversations />
    </div>
  );
}

export default InteractiveArea;
