import flashcardStore from '../../state/flashcardStore';
import { Box, Flex, Grid, Text, Tag, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const MotionBox = motion(Box);

const DailyDeckSelector = () => {
  const { isOpen, onOpen } = useDisclosure({ defaultIsOpen: true });
  const { dailyFlashcards, loadFlashcard } = flashcardStore();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const data = [...dailyFlashcards];

  return (
    <Flex direction="column" mx="4" mb="4" p="2" pb="4" pt="0" bg="white">
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
        {data.slice(0, 6).map((flashcard) => (
          <MotionBox
            key={flashcard._id}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              p="4"
              onClick={() => loadFlashcard(flashcard._id, true)}
              cursor="pointer"
            >
              <Text fontSize="md" mb="10px" fontWeight="bold" isTruncated>
                {flashcard.deckname || 'Untitled'}
              </Text>
              <Flex align="center">
                <Text fontSize="sm" color="gray.600">
                  {flashcard.questions.length} question
                  {flashcard.questions.length > 1 ? 's' : ''}
                </Text>
                {flashcard.studyPeriod === 'spacedRepetition' && (
                  <Box
                    fontSize="12px"
                    marginLeft={'5px'}
                    color="#fb8441"
                    height="26px"
                    padding="3px 8px"
                    borderRadius="8px"
                    borderColor="#ffefe6"
                    borderWidth={'1px'}
                    display="inline-flex"
                    alignItems="center"
                  >
                    Spaced Repetition
                  </Box>
                )}
              </Flex>
              <Flex wrap="wrap" mt="3">
                {flashcard.tags.map((tag, index) => (
                  <Tag
                    key={index}
                    height="fit-content"
                    p="4px 8px"
                    mr="8px"
                    borderRadius="4px"
                    fontSize="sm"
                    cursor="pointer"
                  >
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </Box>
          </MotionBox>
        ))}
      </Grid>
    </Flex>
  );
};

export default DailyDeckSelector;
