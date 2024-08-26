import quizStore from '../../state/quizStore';
import { QuizQuestion } from '../../types';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  Text,
  Box,
  VStack
} from '@chakra-ui/react';
import { toNumber, size as itemSize, filter, includes } from 'lodash';

const QuizEnd = ({
  handleReviewQuiz,
  handleRestartQuiz,
  passed = 40,
  failed = 20,
  skipped = 40
}: {
  handleReviewQuiz: () => void;
  handleRestartQuiz: () => void;
  passed?: string | number;
  failed?: string | number;
  skipped?: string | number;
  scores?: any[];
}) => {
  const title =
    Number(passed) >= 85 ? 'Congratulations!' : "Let's keep studying!";
  return (
    <Box
      fontFamily={'Inter'}
      pt={'36px'}
      mt={'auto'}
      h={'60%'}
      bg={'#F6F6F9'}
      w={'100%'}
    >
      <VStack>
        <Box mb={'20px'}>
          <Text
            textColor={'text.200'}
            fontSize={'24px'}
            fontWeight={'600'}
            lineHeight={'30px'}
          >
            {title}
          </Text>
        </Box>
        <Box>
          <Text
            textColor={'text.400'}
            fontSize={'16px'}
            fontWeight={'400'}
            lineHeight={'21px'}
            textAlign={'center'}
          >
            You reviewed all cards, what would you like to do next?
          </Text>
        </Box>
      </VStack>

      <HStack
        w={'70%'}
        mt={'32px'}
        mb={'40px'}
        justifyContent={'space-around'}
        mx={'auto'}
      >
        {[
          ['#4CAF50', 'Got it right', `${passed}%`],
          ['#FB8441', `Didn't remember`, `${skipped}%`],
          [
            '#F53535',
            'Got it wrong',
            `${failed === 0 && passed === 0 && skipped === 0 ? 100 : failed}%`
          ]
        ].map((item, idx) => {
          return (
            <HStack
              key={idx}
              fontFamily={'Inter'}
              textColor={'text.300'}
              fontSize={'14px'}
              fontWeight={'400'}
              lineHeight={'21px'}
              textAlign={'center'}
            >
              <Box bg={item[0]} borderRadius={'2px'} w={'12px'} h={'12px'} />
              <Box>
                <Text>{item[1]}</Text>
              </Box>
              <Box>
                <Text fontWeight={'600'}>{item[2]}</Text>
              </Box>
            </HStack>
          );
        })}
      </HStack>

      <HStack justifyContent={'space-evenly'}>
        <Button
          borderRadius={'8px'}
          border={'1px solid #E7E8E9'}
          variant={'unstyled'}
          h={'42px'}
          w={'304px'}
          boxShadow={'0px 1px 4px 0px rgba(136, 139, 143, 0.10)'}
          _hover={{ opacity: '0.75' }}
          onClick={handleRestartQuiz}
        >
          Restart Quiz
        </Button>
        <Button
          borderRadius={'8px'}
          border={'1px solid #E7E8E9'}
          variant={'unstyled'}
          h={'42px'}
          w={'304px'}
          boxShadow={'0px 1px 4px 0px rgba(136, 139, 143, 0.10)'}
          _hover={{ opacity: '0.75' }}
          onClick={handleReviewQuiz}
        >
          Review Questions
        </Button>
      </HStack>
    </Box>
  );
};

export const QuizModal = ({
  questions = [],
  isOpen,
  closeOnOverlayClick = false,
  size = '800px',
  scores = [],
  handleRestartQuiz = () => null,
  handleReviewQuiz = () => null,
  onClose = () => null
}: {
  questions: QuizQuestion[];
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
  handleRestartQuiz?: () => void;
  handleReviewQuiz?: () => void;
  scores: {
    questionIdx: string | number;
    score: string | 'true' | 'false' | boolean | null;
    selectedOptions: string[];
  }[];
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'740px'} h={'510px'}>
        <ModalCloseButton />

        <ModalBody p={'0px'} pb={'0px'} bg={'#E1EEFE'}>
          <Box
            h={'100%'}
            w={'100%'}
            display={'flex'}
            alignItems={'flex-start'}
            justifyContent={'center'}
          >
            <QuizEnd
              scores={scores}
              handleRestartQuiz={handleRestartQuiz}
              handleReviewQuiz={handleReviewQuiz}
              passed={Math.round(
                toNumber(
                  (itemSize(filter([...scores], ['score', 'true'])) /
                    toNumber(questions?.length)) *
                    100
                )
              )}
              failed={Math.round(
                toNumber(
                  (itemSize(filter([...scores], ['score', 'false'])) /
                    toNumber(questions?.length)) *
                    100
                )
              )}
              skipped={Math.round(
                toNumber(
                  (itemSize(
                    filter([...scores], (score) => {
                      return includes(['', 'null'], score?.score);
                    })
                  ) /
                    toNumber(questions?.length)) *
                    100
                )
              )}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
