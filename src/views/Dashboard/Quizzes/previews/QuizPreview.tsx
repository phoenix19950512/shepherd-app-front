import {
  QuizConfirmationModal,
  QuizResultModal
} from '../../../../components/quizDecks';
import ApiService from '../../../../services/ApiService';
import {
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  TRUE_FALSE
} from '../../../../types';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Stack,
  Textarea,
  Flex,
  SimpleGrid,
  Icon
} from '@chakra-ui/react';
import clsx from 'clsx';
import {
  capitalize,
  filter,
  first,
  forEach,
  includes,
  isArray,
  isEmpty,
  isNil,
  last,
  map,
  size,
  sortBy,
  split,
  toLower,
  toNumber,
  toString,
  unionBy
} from 'lodash';
import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { IoCheckmarkDone, IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ShareModal from '../../../../components/ShareModal';
import PlansModal from '../../../../components/PlansModal';
import userStore from '../../../../state/userStore';
import { RiRemoteControlLine } from '@remixicon/react';
import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';

type QuizScoreType = {
  questionIdx: string | number;
  questionId: string;
  score: string | 'true' | 'false' | boolean | null;
  selectedOptions: string[];
};

const QuizCard = forwardRef(
  (
    {
      handleSetScore,
      handleStoreQuizHistory,
      quizScores,
      question: { options, _id: id, ...question },
      index,
      showQuizAnswers = false,
      showAnsweredQuestion = false,
      minHeight = 100
    }: {
      minHeight?: number;
      showAnsweredQuestion?: boolean;
      handleShowUnansweredQuestion?: (val: boolean) => void;
      quizScores: QuizScoreType[];
      question: QuizQuestion;
      index: number;
      showQuizAnswers?: boolean;
      handleSetScore?: (
        score: string | 'true' | 'false' | boolean | null,
        idx?: number,
        selectedOptions?: string[],
        questionId?: string
      ) => void;
      handleStoreQuizHistory?: (
        questionId: string,
        answerProvided: string,
        quizId?: string
      ) => void;
    },
    ref?: HTMLTextAreaElement | any
  ) => {
    const quizCardRef = useRef<HTMLTextAreaElement | null>(null);
    const [isMultipleOptionsMulti, setIsMultipleOptionsMulti] = useState(false);
    const [isOpenEnded, setIsOpenEnded] = useState(false);

    let questionType = question?.type ?? OPEN_ENDED;

    if (isMultipleOptionsMulti) {
      questionType = MULTIPLE_CHOICE_MULTI;
    }
    if (isOpenEnded) {
      questionType = OPEN_ENDED;
    }

    useEffect(() => {
      if (isNil(options) || isEmpty(options)) {
        setIsOpenEnded(true);
      }
      if (!isNil(options) && !isEmpty(options)) {
        const isMulti =
          size(filter(options, (option) => option.isCorrect === true)) > 1;

        setIsMultipleOptionsMulti(isMulti);
      }
    }, [options]);

    const handleOptionAnswerHandler = (optionAnswer: string) => {
      if (!isEmpty(optionAnswer)) {
        const [_, index, questionIdx] = split(optionAnswer, ':');
        if (options) {
          const { isCorrect } = options[toNumber(index)];

          const score = toString(isCorrect) === 'true' ? 'true' : 'false';

          handleSetScore(
            score,
            toNumber(questionIdx),
            [optionAnswer],
            id as string
          );
          handleStoreQuizHistory(id as string, toString(isCorrect));
        }
      }
    };
    const handleTFAnswerHandler = (trueFalseAnswer: string) => {
      if (!isEmpty(trueFalseAnswer)) {
        const [_, index, questionIdx] = split(trueFalseAnswer, ':');
        if (options) {
          const { isCorrect } = options[toNumber(index)];

          const score = toString(isCorrect) === 'true' ? 'true' : 'false';

          handleSetScore(
            score,
            toNumber(questionIdx),
            [trueFalseAnswer],
            id as string
          );
          handleStoreQuizHistory(id as string, toString(isCorrect));
        }
      }
    };
    const handleOptionCheckBox = (e: Array<string>) => {
      if (isEmpty(e)) {
        handleSetScore('', toNumber(index), []);
      }

      if (!isEmpty(e)) {
        let questionIdx = '';
        const answers = [];
        forEach(e, (answer) => {
          const [, index, qIdx] = split(answer, ':');
          questionIdx = qIdx;
          const { isCorrect } = options[toNumber(index)];
          if (!isNil(options) && !isEmpty(options)) {
            if (toString(isCorrect) === 'true') {
              answers.push(true);
            }
          }
        });
        const answer = isEmpty(answers) ? 'false' : 'true';
        handleSetScore(answer, toNumber(questionIdx), e, id as string);
        handleStoreQuizHistory(id as string, answer);
      }
    };

    return (
      <HStack alignItems={'flex-start'} flexWrap={'nowrap'} width="100%">
        <Text fontSize="sm" fontWeight="semibold">
          {index + 1}.
        </Text>
        <Box
          as="div"
          className="quiz-tile"
          // ref={(node) => {
          //   // quizCardRef.current = node;
          // }}
          borderRadius={'8px'}
          bg="white"
          boxShadow={'md'}
          w="full"
          minH={minHeight}
          borderWidth={
            showAnsweredQuestion &&
            quizScores[index]?.score === '' &&
            questionType !== OPEN_ENDED
              ? '1px'
              : questionType === OPEN_ENDED &&
                showAnsweredQuestion &&
                isEmpty(first(quizScores[index]?.selectedOptions))
              ? '1px'
              : ''
          }
          borderColor={
            showAnsweredQuestion &&
            quizScores[index]?.score === '' &&
            questionType !== OPEN_ENDED
              ? 'red.200'
              : questionType === OPEN_ENDED &&
                showAnsweredQuestion &&
                isEmpty(first(quizScores[index]?.selectedOptions))
              ? 'red.200'
              : ''
          }
        >
          <VStack alignItems={'flex-start'} justifyContent={'flex-start'}>
            <HStack
              mb={'17px'}
              alignItems={'flex-start'}
              w="100%"
              flexWrap={'nowrap'}
              minH={'48px'}
              h={'130px'}
              bg="#F0F2F4"
              borderTopLeftRadius={'8px'}
              borderTopRightRadius={'8px'}
              px={' 16px'}
              pt={2}
            >
              <Text fontSize="md" fontWeight="semibold">
                {question.question}
              </Text>
            </HStack>

            <Box
              w={'100%'}
              className="font-[Inter] font-[400] text-[14px] leading-[16px]"
            >
              {questionType === MULTIPLE_CHOICE_MULTI && (
                <CheckboxGroup
                  onChange={(e) => {
                    handleOptionCheckBox(e as Array<string>);
                  }}
                  value={quizScores[index]?.selectedOptions}
                >
                  <Flex direction="column" gap={'8px'} mx={3}>
                    {isArray(options) &&
                      options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={clsx(
                            'min-h-[20px] flex justify-start items-start rounded-md !mt-0 !mb-4',
                            {
                              'p-2': showQuizAnswers,
                              '!border !border-[#66BD6A] bg-[#F1F9F1]':
                                showQuizAnswers && option.isCorrect,
                              '!border !border-[#F53535] bg-[#FEF0F0]':
                                showQuizAnswers &&
                                option.isCorrect === false &&
                                includes(
                                  quizScores[index]?.selectedOptions,
                                  `question:${optionIndex}:${index}`
                                )
                            }
                          )}
                        >
                          <div className="h-full w-full flex gap-1.5 justify-start items-start">
                            <Checkbox
                              value={`question:${optionIndex}:${index}`}
                              id={`option${optionIndex}`}
                              name={`question:${optionIndex}:${index}`}
                              isReadOnly={showQuizAnswers}
                            />

                            <Box display={'flex'} w={'100%'} maxW={'95%'}>
                              <Text w={'95%'} ml={'4px'}>
                                {size(options) < 3
                                  ? capitalize(option?.content)
                                  : option?.content}
                              </Text>
                            </Box>
                          </div>
                        </div>
                      ))}
                  </Flex>
                </CheckboxGroup>
              )}

              {questionType === MULTIPLE_CHOICE_SINGLE && (
                <RadioGroup
                  onChange={(e) => {
                    handleOptionAnswerHandler(e);
                  }}
                  value={'1'}
                >
                  <Flex direction="column" gap={'8px'} mx={3}>
                    {isArray(options) &&
                      options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={clsx(
                            'min-h-[20px] flex justify-start items-center rounded-md !mt-0 mb-2',
                            {
                              'p-2': showQuizAnswers,
                              '!border !border-[#F99597] bg-[#FEF1F1] ':
                                showQuizAnswers &&
                                first(quizScores[index]?.selectedOptions) ===
                                  `question:${optionIndex}:${index}` &&
                                !option.isCorrect,
                              '!border !border-[#66BD6A] bg-[#F1F9F1]':
                                showQuizAnswers && option.isCorrect
                            }
                          )}
                        >
                          <Flex mx={3}>
                            <Radio
                              value={
                                first(quizScores[index]?.selectedOptions) ===
                                `question:${optionIndex}:${index}`
                                  ? '1'
                                  : `question:${optionIndex}:${index}`
                              }
                              id={`option${optionIndex}`}
                              name={`question:${optionIndex}:${index}`}
                              isReadOnly={showQuizAnswers}
                            />
                            <Box display={'flex'} flex={1} ml={'4px'}>
                              <Text>
                                {size(options) < 3
                                  ? capitalize(option?.content)
                                  : option?.content}
                              </Text>
                            </Box>
                          </Flex>
                        </div>
                      ))}
                  </Flex>
                </RadioGroup>
              )}

              {questionType === TRUE_FALSE && (
                <RadioGroup
                  onChange={(e) => {
                    handleTFAnswerHandler(e);
                  }}
                  value={'1'}
                >
                  <Flex direction="column" gap={'8px'} mx={3}>
                    {isArray(options) &&
                      options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={clsx(
                            'cursor-pointer min-h-[20px] flex justify-start items-center rounded-md !mt-0 mb-2',
                            {
                              'p-2': showQuizAnswers,
                              '!border !border-[#66BD6A] bg-[#F1F9F1]':
                                showQuizAnswers && option.isCorrect,
                              '!border !border-[#F99597] bg-[#FEF1F1] ':
                                showQuizAnswers &&
                                first(quizScores[index]?.selectedOptions) ===
                                  `question:${optionIndex}:${index}` &&
                                !option.isCorrect
                            }
                          )}
                        >
                          <Flex mx={3}>
                            <Radio
                              value={
                                first(quizScores[index]?.selectedOptions) ===
                                `question:${optionIndex}:${index}`
                                  ? '1'
                                  : `question:${optionIndex}:${index}`
                              }
                              id={`${toLower(option.content)}-${optionIndex}`}
                              name={`question:${optionIndex}:${index}`}
                              isReadOnly={showQuizAnswers}
                            />
                            <Box>
                              <Text ml={'4px'}>
                                {capitalize(option.content)}
                              </Text>
                            </Box>
                          </Flex>
                        </div>
                      ))}
                  </Flex>
                </RadioGroup>
              )}
              {questionType === OPEN_ENDED && (
                <>
                  <Box mt={2} mb="24px" mx={5}>
                    <Textarea
                      ref={(node) => {
                        ref.current = node;
                        quizCardRef.current = node;
                      }}
                      h={'32px'}
                      p={'12px 14px'}
                      border={'none'}
                      borderBottom={'1px'}
                      borderRadius={'0px'}
                      isReadOnly={
                        showQuizAnswers &&
                        !isEmpty(first(quizScores[index]?.selectedOptions))
                      }
                      onChange={(e) => {
                        handleSetScore(
                          'pending',
                          toNumber(index),
                          [e.target.value],
                          id as string
                        );
                      }}
                      value={first(quizScores[index]?.selectedOptions)}
                      placeholder="Please enter your answer"
                      boxShadow={'none'}
                      maxH={'200px'}
                    />
                  </Box>
                  {showQuizAnswers && (
                    <VStack mt={'24px'} w={'100%'} p={4}>
                      <Box mr={2}>
                        <Text
                          fontSize={'14px'}
                          fontFamily={'Inter'}
                          fontWeight={'700'}
                          lineHeight={'17px'}
                          textColor={'text.200'}
                        >
                          Answer:
                        </Text>
                      </Box>

                      <Textarea
                        maxH={'40px'}
                        h={'32px'}
                        w={'100%'}
                        p={'8px 10px'}
                        isReadOnly
                        value={question?.answer}
                      />
                    </VStack>
                  )}

                  {showQuizAnswers &&
                    !isEmpty(first(quizScores[index]?.selectedOptions)) && (
                      <Box
                        position={'relative'}
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        flexGrow={1}
                        justifyContent={'flex-end'}
                        bg={'#F9F9FB'}
                        minH={'40px'}
                        w={'100%'}
                      >
                        {/* open ended buttons */}

                        {questionType === OPEN_ENDED && (
                          <HStack
                            bg={'whiteAlpha.900'}
                            p={4}
                            w={'100%'}
                            justifyContent={'space-around'}
                            spacing={'15px'}
                          >
                            <Button
                              fontSize={'14px'}
                              variant={'unstyled'}
                              bg={'#EDF7EE'}
                              color={'#4CAF50'}
                              px={'2'}
                              onClick={async () => {
                                if (quizScores[index]?.score === 'pending') {
                                  handleSetScore(
                                    'true',
                                    toNumber(index),
                                    quizScores[index].selectedOptions,
                                    id as string
                                  );
                                  handleStoreQuizHistory(
                                    id as string,
                                    first(quizScores[index].selectedOptions)
                                  );

                                  // handleSumbit
                                }
                              }}
                              sx={{
                                marginLeft: '0 !important',
                                marginBottom: '4px'
                              }}
                              isDisabled={
                                quizScores[index]?.score !== 'pending' &&
                                quizScores[index]?.score !== 'true'
                              }
                            >
                              <HStack
                                alignItems={'center'}
                                justifyContent={'center'}
                              >
                                <IoCheckmarkDone color="#4CAF50" />
                                <Text mx={'8px'}>Got it right</Text>
                              </HStack>
                            </Button>
                            <Button
                              bg={'#FFEFE6'}
                              color={'#FB8441'}
                              fontSize={'14px'}
                              variant={'unstyled'}
                              px={'2'}
                              onClick={() => {
                                if (quizScores[index]?.score === 'pending') {
                                  handleSetScore(
                                    'null',
                                    toNumber(index),
                                    quizScores[index].selectedOptions,
                                    id as string
                                  );
                                  handleStoreQuizHistory(
                                    id as string,
                                    first(quizScores[index].selectedOptions)
                                  );
                                }
                              }}
                              sx={{
                                marginLeft: '0 !important',
                                marginBottom: '4px !important'
                              }}
                              isDisabled={
                                quizScores[index]?.score !== 'pending' &&
                                quizScores[index]?.score !== 'null'
                              }
                            >
                              <HStack
                                alignItems={'center'}
                                justifyContent={'center'}
                              >
                                <QuestionOutlineIcon color={'#FB8441'} />
                                <Text mx={'8px'}>Didn’t remember</Text>
                              </HStack>
                            </Button>
                            <Button
                              bg={'#FEECEC'}
                              color={'#F53535'}
                              fontSize={'14px'}
                              variant={'unstyled'}
                              px={'2'}
                              onClick={() => {
                                if (quizScores[index]?.score === 'pending') {
                                  handleSetScore(
                                    'false',
                                    toNumber(index),
                                    quizScores[index].selectedOptions,
                                    id as string
                                  );
                                  handleStoreQuizHistory(
                                    id as string,
                                    first(quizScores[index].selectedOptions)
                                  );
                                }
                              }}
                              sx={{
                                marginLeft: '0 !important',
                                marginBottom: '4px !important'
                              }}
                              isDisabled={
                                quizScores[index]?.score !== 'pending' &&
                                quizScores[index]?.score !== 'false'
                              }
                            >
                              <HStack
                                alignItems={'center'}
                                justifyContent={'center'}
                              >
                                <IoCloseOutline color="#F53535" />
                                <Text>Got it wrong</Text>
                              </HStack>
                            </Button>
                          </HStack>
                        )}
                      </Box>
                    )}
                </>
              )}
            </Box>
          </VStack>
        </Box>
      </HStack>
    );
  }
);
const QuizPreviewer = ({
  title,
  questions,
  quizId,
  togglePlansModal,
  setTogglePlansModal,
  apiKey
}: {
  title: string;
  questions: QuizQuestion[];
  quizId: string;
  togglePlansModal: boolean;
  apiKey?: string;
  setTogglePlansModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetUploadingState?: (value: boolean) => void;
}) => {
  const navigate = useNavigate();

  const quizCardRef = useRef<HTMLTextAreaElement | any>(null);

  const [minHeight, setMinHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showUnansweredQuestions, setShowUnansweredQuestions] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);
  const [cloneInProgress, setCloneInProgress] = useState(false);
  const { user, hasActiveSubscription } = userStore();
  const toast = useCustomToast();
  const [scores, setScores] = useState<QuizScoreType[]>([]);

  const handleCloseResultsModal = () => setShowResults(false);

  const handleShowUnansweredQuestion = (value: boolean) =>
    setShowUnansweredQuestions(value);

  const handleLeaveQuiz = () => {
    handleCloseResultsModal();
    navigate(`/dashboard/quizzes`);
  };

  const handleReviewQuiz = () => {
    handleCloseResultsModal();
    navigate(`/dashboard/quizzes/create?quiz_id=${quizId}`);
  };

  const handleSubmit = async () => {
    try {
      await ApiService.storeQuizScore({
        quizId,
        score: size(filter(scores, ['score', 'true'])),
        scoreDetails: scores
      });
    } catch (error) {
      // console.log('error ========>> ', error);
    }
  };

  const handleRestartQuiz = () => {
    setScores([]);
    setTimeout(() => {
      const arr = new Array(questions?.length);
      const newArray = Array.from(arr, (_, idx) => ({
        questionIdx: idx,
        score: '',
        selectedOptions: [],
        questionId: ''
      }));
      setScores(newArray);
    }, 1000);
    setShowUnansweredQuestions(false);

    if (quizCardRef.current && quizCardRef.current.value) {
      quizCardRef.current.value = '';
    }
  };

  const handleSetScore = (
    score: 'true' | 'false' | boolean | null,
    idx: number | null,
    selectedOptions: string[] = [],
    questionId = ''
  ) => {
    if (idx !== null) {
      const newScores = [...scores];
      newScores.splice(idx, 1, {
        questionIdx: idx,
        score,
        selectedOptions,
        questionId
      });
      setScores(sortBy(newScores, ['questionIdx']));
      return;
    }

    setScores((prevScores) =>
      sortBy(
        unionBy(
          [
            {
              questionIdx: prevScores.length,
              score,
              selectedOptions,
              questionId
            }
          ],
          [...prevScores],
          'questionIdx'
        ),
        ['questionIdx']
      )
    );
  };

  const handleStoreQuizHistory = async (
    questionId = '',
    answerProvided = '',
    quiz_id = quizId
  ) => {
    await ApiService.storeQuizHistory({
      questionId,
      answerProvided,
      quizId: quiz_id
    });
  };

  const handleContinueQuiz = () => {
    handleShowUnansweredQuestion(true);
    setShowConfirmation(false);
  };

  const handleUnansweredQuestionsCount = useMemo(
    () => filter(scores, (score) => score?.score === '')?.length,
    [scores]
  );
  const cloneQuizHandler = async () => {
    setCloneInProgress(true);
    try {
      const d = await ApiService.cloneQuiz(quizId);
      const data = await d.json();
      toast({
        position: 'top-right',
        title: `Quiz Cloned Succesfully`,
        status: 'success'
      });
      setCloneInProgress(false);
      setTimeout(() => {
        navigate(`/dashboard/quizzes/create?quiz_id=${data.data._id}`);
      }, 200);
    } catch (error) {
      setCloneInProgress(false);
      toast({
        position: 'top-right',
        title: `Problem cloning quiz, please try again later!`,
        status: 'error'
      });
    }
  };
  useEffect(() => {
    const elems = document.querySelectorAll('div.quiz-tile');

    setMinHeight(
      last(
        sortBy(
          Array.from(elems, (el) => el?.clientHeight),
          Math.floor
        )
      )
    );
  }, [questions]);

  useEffect(() => {
    if (!isEmpty(questions) && isEmpty(scores)) {
      handleRestartQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  return (
    <>
      <Box
        as="section"
        pt={'40px'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        h={'100%'}
        maxH={'100%'}
        overflowY={'auto'}
        mr={'auto'}
        // _last={{ display: 'hidden' }}
      >
        <Box w="100%" maxW="95%" mb={10} position={'relative'}>
          <HStack mx={'auto'} justifyContent={'center'}>
            {!isEmpty(questions) && (
              <Box
                display={'flex'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                w={'100%'}
                pb={'16px'}
              >
                <HStack justifyContent={'flex-start'} alignItems={'center'}>
                  <Box>
                    <Text
                      fontFamily="Inter"
                      fontWeight="700"
                      fontSize="24px"
                      lineHeight="27px"
                      color="text.200"
                    >
                      Take Your Quiz
                    </Text>
                  </Box>
                </HStack>
                <HStack
                  justifyContent={'flex-end'}
                  alignItems={'center'}
                  pr={'45px'}
                >
                  <HStack
                    alignItems={'center'}
                    justifyContent={'space-between'}
                  >
                    {user && <ShareModal type="quiz" />}
                    {user && hasActiveSubscription && apiKey && (
                      <Button
                        leftIcon={
                          <Icon as={RiRemoteControlLine} fontSize={'16px'} />
                        }
                        disabled={cloneInProgress}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        borderRadius="8px"
                        fontSize="16px"
                        bg="#f4f4f5"
                        color="#000"
                        w={'180px'}
                        h={'40px'}
                        onClick={cloneQuizHandler}
                        _hover={{ bg: '#e4e4e5' }}
                        _active={{ bg: '#d4d4d5' }}
                      >
                        Clone Quiz
                      </Button>
                    )}
                    {togglePlansModal && (
                      <PlansModal
                        message="Up to 4 weeks free!"
                        subMessage="One-click Cancel at anytime."
                        togglePlansModal={togglePlansModal}
                        setTogglePlansModal={setTogglePlansModal}
                      />
                    )}
                    {!showQuizAnswers && handleUnansweredQuestionsCount > 0 && (
                      <Box>
                        <Button
                          onClick={() => {
                            user && setShowConfirmation(true);
                          }}
                          bg={'#207DF7'}
                          w={'180px'}
                          h={'40px'}
                          _hover={{ bg: 'red.200' }}
                          disabled={user === null || cloneInProgress}
                        >
                          Submit Quiz
                        </Button>
                      </Box>
                    )}
                    {!showQuizAnswers &&
                      handleUnansweredQuestionsCount === 0 && (
                        <Box>
                          <Button
                            variant="solid"
                            onClick={() => {
                              setShowConfirmation(false);
                              setShowQuizAnswers(true);
                              handleSubmit();
                            }}
                            w={'180px'}
                            h={'40px'}
                            disabled={user === null}
                          >
                            Submit Quiz
                          </Button>
                        </Box>
                      )}
                    {showQuizAnswers && (
                      <Box>
                        <Button
                          variant="solid"
                          onClick={() => {
                            setShowQuizAnswers(false);
                            setShowResults(true);
                            handleSubmit();
                          }}
                          w={'180px'}
                          h={'40px'}
                        >
                          Close Quiz
                        </Button>
                      </Box>
                    )}
                  </HStack>
                </HStack>
              </Box>
            )}
          </HStack>

          <Box
            maxH={'75vh'}
            h={'100%'}
            overflowY={'auto'}
            sx={{
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-track': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                // background: 'text.400',
                borderRadius: '24px'
              }
            }}
          >
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacingY="25px"
              spacingX={'5px'}
            >
              {!isEmpty(questions) &&
                !isEmpty(scores) &&
                map(questions, (question, index) => {
                  return (
                    <Flex>
                      <QuizCard
                        ref={quizCardRef}
                        showAnsweredQuestion={showUnansweredQuestions}
                        handleShowUnansweredQuestion={
                          handleShowUnansweredQuestion
                        }
                        quizScores={scores}
                        key={question?.id}
                        question={question}
                        index={index}
                        handleStoreQuizHistory={handleStoreQuizHistory}
                        handleSetScore={handleSetScore}
                        showQuizAnswers={showQuizAnswers}
                        minHeight={minHeight}
                      />
                    </Flex>
                  );
                })}
            </SimpleGrid>
            <Box p="32px" />
          </Box>
        </Box>
      </Box>

      {showConfirmation && (
        <QuizConfirmationModal
          handleContinueQuiz={handleContinueQuiz}
          title={title}
          isOpen={showConfirmation}
          onClose={() => {
            setShowConfirmation(false);
            setShowQuizAnswers(true);
            // setShowResults(true);
            handleSubmit();
          }}
          count={handleUnansweredQuestionsCount}
        />
      )}

      {showResults && (
        <QuizResultModal
          handleRestartQuiz={() => {
            handleRestartQuiz();
            handleCloseResultsModal();
          }}
          onClose={handleLeaveQuiz}
          handleReviewQuiz={handleReviewQuiz}
          isOpen={showResults}
          scores={scores}
          questions={questions}
        />
      )}
    </>
  );
};

export default QuizPreviewer;
