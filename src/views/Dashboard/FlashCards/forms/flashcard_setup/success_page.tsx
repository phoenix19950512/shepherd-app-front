import flashcardStore from '../../../../../state/flashcardStore';
import { useCallback } from 'react';
import { useFlashcardWizard } from '../../context/flashcard';
import { Button, Text, Flex, HStack } from '@chakra-ui/react';
import React from 'react';

const SuccessState = ({ reset }: { reset: () => void }) => {
  const { flashcards, loadFlashcard } = flashcardStore();
  const { flashcardData } = useFlashcardWizard();

  const handleStudyClick = useCallback(() => {
    const flashcard = flashcards?.find(
      (flashcard) => flashcard.deckname === flashcardData.deckname
    );
    if (flashcard) {
      loadFlashcard(flashcard._id, false);
    }
  }, [flashcardData, flashcards, loadFlashcard]);

  return (
    <Flex
      width="100%"
      minHeight={'calc(100vh - 300px)'}
      height="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Text
        fontSize="18px"
        lineHeight="23px"
        width="60%"
        letterSpacing="0.7%"
        textAlign="center"
        fontWeight="500"
      >
        Your {flashcardData.deckname} flashcard has been successfully created
      </Text>
      <Text
        fontSize="14px"
        lineHeight="20px"
        color="#585F68"
        textAlign="center"
        fontWeight="400"
        mt={4}
      >
        Flashcards have been saved to your flashcards
      </Text>
      <HStack
        display={'flex'}
        mt={4}
        justifyItems={'center'}
        alignItems={'center'}
        spacing={5}
      >
        <Button
          variant="solid"
          colorScheme="primary"
          size="sm"
          fontSize={'14px'}
          padding="20px 25px"
          onClick={handleStudyClick}
        >
          <svg
            style={{ marginRight: '8px' }}
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6862 12.9228L10.8423 16.7979C10.7236 17.0473 10.4253 17.1533 10.1759 17.0346C10.1203 17.0082 10.0701 16.9717 10.0278 16.9269L7.07658 13.8113C6.99758 13.7279 6.89228 13.6743 6.77838 13.6594L2.52314 13.1032C2.24932 13.0673 2.05637 12.8164 2.09216 12.5426C2.10014 12.4815 2.11933 12.4225 2.14876 12.3684L4.19993 8.59893C4.25484 8.49801 4.27333 8.38126 4.25229 8.26835L3.46634 4.0495C3.41576 3.77803 3.59484 3.51696 3.86631 3.46638C3.92684 3.45511 3.98893 3.45511 4.04946 3.46638L8.26831 4.25233C8.38126 4.27337 8.49801 4.25488 8.59884 4.19998L12.3683 2.1488C12.6109 2.01681 12.9146 2.10644 13.0465 2.349C13.076 2.40308 13.0952 2.46213 13.1031 2.52318L13.6593 6.77842C13.6743 6.89233 13.7279 6.99763 13.8113 7.07662L16.9269 10.0278C17.1274 10.2177 17.136 10.5342 16.9461 10.7346C16.9038 10.7793 16.8535 10.8158 16.7979 10.8423L12.9228 12.6862C12.8191 12.7356 12.7355 12.8191 12.6862 12.9228ZM13.3502 14.5288L14.5287 13.3503L18.0643 16.8858L16.8858 18.0643L13.3502 14.5288Z"
              fill="white"
            />
          </svg>
          Study
        </Button>
        <Button
          variant="solid"
          colorScheme="blackAlpha"
          bg="white"
          size="sm"
          fontSize={'14px'}
          mt={4}
          padding="20px 25px"
          border="1px solid #EDF2F7"
          _hover={{
            bg: 'white'
          }}
          onClick={reset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              stroke="#000"
              fillRule="evenodd"
              d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
              clipRule="evenodd"
            />
          </svg>

          <Text marginLeft={'8px'} color="#000">
            Reset
          </Text>
        </Button>
      </HStack>
    </Flex>
  );
};

export default SuccessState;
