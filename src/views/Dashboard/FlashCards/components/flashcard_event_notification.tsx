import FlashcardEmpty from '../../../../assets/flashcard_empty_state.png';
import {
  useFlashcardWizard,
  QuestionGenerationStatusEnum
} from '../context/flashcard';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  Text
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const FlashCardEventNotifier = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { isMinimized, flashcardData, questionGenerationStatus } =
    useFlashcardWizard();

  useEffect(() => {
    if (
      isMinimized &&
      questionGenerationStatus !== QuestionGenerationStatusEnum.INIT
    ) {
      setIsOpen((prev) => !prev);
    }
    if (!isMinimized) {
      setIsOpen(false);
    }
  }, [isMinimized, questionGenerationStatus]);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered>
      <ModalOverlay />
      <ModalContent
        maxWidth="300px"
        borderRadius="12px"
        minWidth={{ base: '80%', md: '600px' }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          width="100%"
          paddingBottom={'20px'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Box
            minHeight="150px"
            w="100%"
            height="40%"
            bg={
              questionGenerationStatus ===
              QuestionGenerationStatusEnum.SUCCESSFUL
                ? `#4CAF50`
                : '#F53535'
            }
          />
          <Box
            display={'flex'}
            padding="10px"
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            <Text
              color="#212224"
              fontFamily="Inter"
              fontSize="16px"
              mt="10px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="30px"
              letterSpacing="-0.48px"
            >
              {questionGenerationStatus ===
              QuestionGenerationStatusEnum.SUCCESSFUL
                ? ` Your ${flashcardData?.deckname} flashcard questions have generated
              successfully`
                : ` Your ${flashcardData?.deckname} flashcard questions failed to generate`}
            </Text>

            <Text
              color="#6E7682"
              fontFamily="Inter"
              width="60%"
              fontSize="14px"
              mt="10px"
              fontStyle="normal"
              fontWeight="400"
              lineHeight="21px"
              textAlign={'center'}
              letterSpacing="-0.048px"
            >
              {questionGenerationStatus ===
              QuestionGenerationStatusEnum.SUCCESSFUL
                ? `  Flashcards have been saved to your flashcards`
                : `We couldn't generate questions at this time`}
            </Text>

            <Button
              p="10px 40px"
              mt="15px"
              colorScheme="blue"
              onClick={() =>
                navigate('/dashboard/flashcards/create?type=flashcard')
              }
            >
              Continue
            </Button>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default FlashCardEventNotifier;
