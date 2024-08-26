import { useEffect, useState } from 'react';
import quizStore from '../../state/quizStore';
import { LightningBoltIcon, TakeQuizIcon } from '../icons';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  Text,
  Box,
  VStack,
  Tag,
  TagLeftIcon,
  TagLabel
} from '@chakra-ui/react';
import { useNavigate } from 'react-router';

const QuizLandingFooter = ({
  showMinimize = false,
  onMinimize
}: {
  showMinimize?: boolean;
  onMinimize?: () => void;
}) => {
  const { quiz, handleToggleStartQuizModal } = quizStore();

  const renderTag = () => {
    return [...(quiz?.tags || [])].splice(0, 3).map((tag) => (
      <Tag
        width={'fit-content'}
        maxWidth={'fit-content'}
        key={tag}
        borderRadius="5"
        marginRight="10px"
        background="#f7f8fa"
        size="md"
      >
        <TagLeftIcon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            width="25px"
            height="25px"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
        </TagLeftIcon>
        <TagLabel
          whiteSpace={'nowrap'}
          overflow="visible" // Allows text to overflow
          textOverflow="clip"
        >
          {tag?.toLowerCase()}
        </TagLabel>
      </Tag>
    ));
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      background="transparent"
      width={'100%'}
      borderTop="1px solid #eee"
      p={4}
      justifyContent={'space-between'}
    >
      <Box>{renderTag()}</Box>
      <Box>
        {showMinimize && (
          <Button
            variant="ghost"
            rounded="100%"
            padding="5px"
            bg="#FFEFE6"
            mr="10px"
            _hover={{ bg: '#FFEFE6', transform: 'scale(1.05)' }}
            color="black"
            onClick={() => {
              onMinimize && onMinimize();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              width={'15px'}
              height={'15px'}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12h-15"
              />
            </svg>
          </Button>
        )}
        <Button
          variant="ghost"
          rounded="100%"
          padding="10px"
          bg="#FEECEC"
          onClick={() => handleToggleStartQuizModal(false)}
          _hover={{ bg: '#FEECEC', transform: 'scale(1.05)' }}
          color="black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={'15px'}
            height={'15px'}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </Box>
    </Box>
  );
};

export const QuizModal = ({
  isOpen,
  closeOnOverlayClick = false,
  size = '800px',
  title = '',
  count = 0
}: {
  title?: string;
  count?: number;
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
}) => {
  const navigate = useNavigate();
  const { quiz, handleToggleStartQuizModal } = quizStore();
  const [modalQuiz, setModalQuiz] = useState(null);

  useEffect(() => {
    setModalQuiz(quiz);
  }, [quiz]);

  const handleStartQuiz = () => {
    navigate(`/dashboard/quizzes/take?quiz_id=${modalQuiz?._id}`);
    setTimeout(() => {
      handleToggleStartQuizModal(false);
    }, 100);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleToggleStartQuizModal(false)}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'740px'} h={'510px'}>
        <ModalCloseButton />

        {false && (
          <ModalHeader bg={'#F9F9FB'}>
            <HStack
              p={'24px 30px 0px'}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Text>Study Session</Text>
              <Button
                onClick={() => handleToggleStartQuizModal(false)}
                bg={'red.400'}
                w={'124px'}
                h={'34px'}
                _hover={{ bg: 'red.200' }}
              >
                End
              </Button>
            </HStack>
          </ModalHeader>
        )}

        <ModalBody bg={'#F9F9FB'}>
          {modalQuiz && (
            <Box
              h={'100%'}
              w={'100%'}
              display={'flex'}
              alignItems={'flex-start'}
              justifyContent={'center'}
            >
              <Box w={'100%'} h={'100%'} pt={'20px'}>
                <VStack
                  alignItems={'center'}
                  justifyContent={'center'}
                  w={'100%'}
                  h={'100%'}
                >
                  <Box mb={'24px'}>
                    <TakeQuizIcon
                      className={'h-[100px] w-[100px]'}
                      onClick={() => {
                        return;
                      }}
                    />
                  </Box>

                  <VStack mb={16}>
                    <Box mb={'16px'}>
                      <Text
                        fontSize={'24px'}
                        fontWeight={'600'}
                        fontFamily={'Inter'}
                        color={'text.200'}
                        textAlign={'center'}
                        lineHeight={'29px'}
                        textTransform={'capitalize'}
                      >
                        {modalQuiz?.title} quiz
                      </Text>
                    </Box>
                    <Box>
                      <Text
                        fontSize={'16px'}
                        fontFamily={'Inter'}
                        color={'text.400'}
                        textAlign={'center'}
                      >
                        You have {modalQuiz?.questions?.length || 0} question
                        {modalQuiz?.questions?.length > 0 ? 's' : ''}
                        , test your knowledge on your <br />
                        {modalQuiz?.title} quiz
                      </Text>
                    </Box>
                  </VStack>
                  <HStack
                    w={'100%'}
                    sx={{
                      marginTop: 'auto !important'
                    }}
                    justifyContent={'center'}
                    pt={8}
                    pb={'40px'}
                  >
                    <Button
                      w={'500px'}
                      h={'54px'}
                      borderRadius="8px"
                      fontSize="14px"
                      lineHeight="20px"
                      variant="solid"
                      colorScheme="primary"
                      onClick={handleStartQuiz}
                      display={'flex'}
                      flexDirection={'row'}
                      justifyContent={'center'}
                    >
                      <LightningBoltIcon
                        className={'h-[20px] w-[20px] mx-2'}
                        onClick={() => {
                          return;
                        }}
                      />
                      Study
                    </Button>
                  </HStack>

                  <HStack alignItems={'flex-end'}>
                    <QuizLandingFooter />
                  </HStack>
                </VStack>
              </Box>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
