import LoaderOverlay from '../../../../components/loaderOverlay';
import libraryTopicStore from '../../../../state/libraryTopicStore';
import TitleCard from './TitleCard';
import { SimpleGrid, Box, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface LibraryTopicProps {
  subjectId: string;
  onSelectTopic: (topicId: string) => void;
}

const TopicList: React.FC<LibraryTopicProps> = ({
  subjectId,
  onSelectTopic
}) => {
  const { fetchlibraryTopics, isLoading, libraryTopics } = libraryTopicStore();

  useEffect(() => {
    if (subjectId) {
      fetchlibraryTopics(subjectId);
    }
  }, [subjectId, fetchlibraryTopics]);

  // if (isLoading && !libraryTopics?.length) {
  //   return <LoaderOverlay />;
  // }
  return !libraryTopics?.length ? (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'start'}
      height={'calc(100vh - 350px)'}
    >
      <Box
        width={'100%'}
        display={'flex'}
        height="100%"
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
      >
        <img src="/images/empty_illustration.svg" alt="empty directory icon" />
        <Text
          color="text.300"
          fontFamily="Inter"
          fontSize="16px"
          fontStyle="normal"
          fontWeight="500"
          lineHeight="21px"
          letterSpacing="0.112px"
        >
          No cards to display
        </Text>
      </Box>
    </Box>
  ) : (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} spacing={10}>
      {libraryTopics.map((topic) => (
        <TitleCard
          key={topic._id}
          data={{ name: topic.name }}
          onClick={() => onSelectTopic(topic._id)}
        />
      ))}
    </SimpleGrid>
  );
};

export default TopicList;
