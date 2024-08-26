import { QuestionIcon } from '@chakra-ui/icons';
import { languages } from '../../../../helpers';
import useIsMobile from '../../../../helpers/useIsMobile';
import OptionBadge from '../components/optionBadge';
import QuestionReviewCard from '../components/question_preview_card';
import {
  useFlashcardWizard,
  FlashcardQuestion,
  ModeEnum
} from '../context/flashcard';
import { TypeEnum } from '../create';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Flex,
  Input,
  FormControl,
  FormLabel,
  Select,
  Tooltip
} from '@chakra-ui/react';
import { useState, useMemo, ChangeEvent, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuestionsPreview({
  activeBadge,
  handleBadgeClick,
  onConfirm,
  isLoading,
  isCompleted,
  setFlashcardData
}: {
  activeBadge?: TypeEnum;
  handleBadgeClick: (v: TypeEnum) => void;
  onConfirm: () => void;
  isLoading: boolean;
  isCompleted: boolean;
  setFlashcardData?: React.Dispatch<SetStateAction<any>>;
}) {
  const {
    questions,
    deleteQuestion,
    goToQuestion,
    currentQuestionIndex,
    currentStep,
    goToStep,
    mode,
    loadMoreQuestions,
    resetFlashcard,
    addQuestionsToFlashcard,
    setQuestions
  } = useFlashcardWizard();

  const [preferredLanguage, setPreferredLanguage] = useState<
    (typeof languages)[number]
  >(languages[0]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question: FlashcardQuestion) => {
      const questionText = question.question || '';
      return (
        searchTerm.length === 0 ||
        questionText.toLowerCase().includes(searchTerm)
      );
    });
  }, [questions, searchTerm]);

  const findQuestionIndex = (question) => {
    return questions.findIndex((que) => que.question === question);
  };

  const generateOptions = (questionType: string, options?: string[]) => {
    if (questionType === 'trueFalse') {
      return ['True', 'False'].map((option) => ({
        label: option,
        value: option
      }));
    } else {
      return options?.map((option) => ({
        label: option,
        value: option
      }));
    }
  };

  const handleLoadMore = async () => {
    setIsFetchingMore(true);
    try {
      await loadMoreQuestions(5, preferredLanguage);
    } catch (error) {
      // console.error('Failed to fetch more questions:', error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const hasQuestions = useMemo(
    () => questions.some((question) => question.question),
    [questions]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      width="100%"
      bg="#F8F9FB"
      p="40px"
    >
      <Flex
        position="sticky"
        top="0"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        bg="#F8F9FB"
        zIndex="1"
        paddingBottom="20px"
      >
        <VStack width="100%" alignItems="center" justifyContent="space-between">
          <Flex
            alignItems="center"
            width="100%"
            justifyContent="space-between"
            mt="20px"
            mb="10px"
          >
            <Text
              fontSize="14px"
              lineHeight="20px"
              fontWeight="500"
              color="#212224"
            >
              Review flashcard questions
            </Text>
            <Input
              placeholder="Search questions"
              value={searchTerm}
              marginRight="5px"
              backgroundColor="#FFF"
              borderRadius="5px"
              height={'30px'}
              onChange={handleSearchChange}
              width="200px"
              _placeholder={{ fontSize: '14px', lineHeight: '20px' }}
            />
          </Flex>
          <HStack
            spacing="20px"
            width="100%"
            marginBottom={'15px'}
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack spacing="20px">
              <OptionBadge
                text={isMobile ? '' : 'Flashcards'}
                icon={(isActive) => {
                  return (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                      color={isActive ? '#FFFFFF' : '#6E7682'}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                      />
                    </svg>
                  );
                }}
                isActive={activeBadge === TypeEnum.FLASHCARD}
                onClick={() => handleBadgeClick(TypeEnum.FLASHCARD)}
              />
              {/* <OptionBadge
                text={isMobile ? '' : 'Mnemonics'}
                icon={(isActive) => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    color={isActive ? '#FFFFFF' : '#6E7682'}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                )}
                isActive={activeBadge === TypeEnum.MNEOMONIC}
                onClick={() => handleBadgeClick(TypeEnum.MNEOMONIC)}
              /> */}
            </HStack>
            <HStack>
              <Button
                mr="5px"
                onClick={() => resetFlashcard()}
                borderRadius="10px"
                p="10px 25px"
                fontSize="14px"
                lineHeight="20px"
                colorScheme="whiteAlpha"
              >
                Reset
              </Button>
              {!isCompleted && (
                <Button
                  isDisabled={
                    questions.filter((question) => question.question).length ===
                    0
                  }
                  isLoading={isLoading}
                  onClick={() => onConfirm()}
                  borderRadius="10px"
                  p="10px 25px"
                  fontSize="14px"
                  lineHeight="20px"
                  variant="solid"
                  colorScheme="primary"
                >
                  {mode === ModeEnum.CREATE ? 'Confirm' : 'Save'}
                </Button>
              )}
              {isCompleted && (
                <Button
                  isDisabled={
                    questions.filter((question) => question.question).length ===
                    0
                  }
                  isLoading={isLoading}
                  onClick={() => {
                    navigate('/dashboard/flashcards');
                    resetFlashcard();
                    setQuestions([]);
                  }}
                  borderRadius="10px"
                  border="1px solid #EDF2F7"
                  p="10px 25px"
                  fontSize="14px"
                  lineHeight="20px"
                  variant="solid"
                  colorScheme="blackAlpha"
                  bg="white"
                  _hover={{
                    bg: 'white'
                  }}
                >
                  <Text color="#000">Exit</Text>
                </Button>
              )}
            </HStack>
          </HStack>
        </VStack>
      </Flex>

      <Box
        flex="1"
        overflowY="scroll"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          maskImage: 'linear-gradient(to bottom, black 90%, transparent)'
        }}
      >
        {/* <Flex
          alignItems="center"
          justifyContent="space-between"
          mt="20px"
          mb="10px"
        >
          <Text
            fontSize="14px"
            lineHeight="20px"
            fontWeight="500"
            color="#212224"
          >
            Review flashcard questions
          </Text>
          <Input
            placeholder="Search questions"
            value={searchTerm}
            marginRight="5px"
            backgroundColor="#FFF"
            borderRadius="5px"
            height={'40px'}
            onChange={handleSearchChange}
            width="200px"
            _placeholder={{ fontSize: '14px', lineHeight: '20px' }}
          />
        </Flex> */}
        {filteredQuestions.filter((question) => question.question).length >
          0 && (
          <FormControl mb={4}>
            <FormLabel textColor={'text.600'}>
              Preferred Language*{' '}
              <Tooltip
                hasArrow
                label="Preferred language to load more questions in!
            "
                placement="right-end"
              >
                <QuestionIcon mx={2} w={3} h={3} />
              </Tooltip>
            </FormLabel>
            <Select
              isRequired
              name="language_select"
              value={preferredLanguage}
              onChange={(e) => {
                setPreferredLanguage(
                  e.target.value as typeof preferredLanguage
                );
              }}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        <VStack spacing={10} width={'100%'}>
          {filteredQuestions
            .filter((question) => question.question)
            .map((question, index: number) => (
              <QuestionReviewCard
                isCurrentQuestion={
                  currentQuestionIndex === findQuestionIndex(question.question)
                }
                onEdit={() => {
                  if (currentStep !== 1) {
                    goToStep(1);
                  }
                  goToQuestion(findQuestionIndex(question.question));
                }}
                onDelete={() =>
                  deleteQuestion(findQuestionIndex(question.question))
                }
                index={index}
                options={generateOptions(
                  question.questionType,
                  question.options
                )}
                correctAnswer={question.answer}
                question={question.question}
              />
            ))}
        </VStack>
        {filteredQuestions.filter((question) => question.question).length ? (
          <Box
            display="flex"
            width="100%"
            justifyContent={'center'}
            alignItems={'center'}
            mt={4}
            mb={6}
          >
            <Button
              disabled={isFetchingMore}
              onClick={handleLoadMore}
              isLoading={isFetchingMore}
              loadingText="Loading"
            >
              Load More
            </Button>
            <Button
              disabled={isFetchingMore}
              ml={2}
              onClick={addQuestionsToFlashcard}
              isLoading={isFetchingMore}
              loadingText="Loading"
            >
              Add Question
            </Button>
          </Box>
        ) : (
          ''
        )}
      </Box>
    </Box>
  );
}
