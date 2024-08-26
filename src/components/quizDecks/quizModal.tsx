import { LightningBoltIcon, TakeQuizIcon } from '../../components/icons';
import ApiService from '../../services/ApiService';
import quizStore from '../../state/quizStore';
import {
  MULTIPLE_CHOICE_MULTI,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  TRUE_FALSE
} from '../../types';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
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
  Progress,
  Box,
  VStack,
  RadioGroup,
  Stack,
  Radio,
  Textarea,
  Tag,
  TagLeftIcon,
  TagLabel,
  CheckboxGroup,
  Checkbox
} from '@chakra-ui/react';
import {
  capitalize,
  first,
  isArray,
  isEmpty,
  isNil,
  sortBy,
  split,
  toLower,
  toNumber,
  toString,
  unionBy,
  size as itemSize,
  filter,
  map,
  debounce,
  forEach
} from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  IoCheckmarkDone,
  IoCloseOutline,
  IoChevronDown
} from 'react-icons/io5';
import { useNavigate } from 'react-router';

const QuizLandingFooter = ({
  showMinimize = false,
  onMinimize
}: {
  showMinimize?: boolean;
  onMinimize?: () => void;
}) => {
  const { loadQuiz, quiz } = quizStore();

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
          onClick={() => loadQuiz(null)}
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

const QuizLanding = ({
  startQuiz = () => null,
  title = '',
  count = 0
}: {
  startQuiz: () => void;
  title?: string;
  count?: number;
}) => {
  return (
    <Box w={'100%'} h={'100%'} pt={'60px'}>
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

        <VStack>
          <Box mb={'16px'}>
            <Text
              fontSize={'24px'}
              fontWeight={'600'}
              fontFamily={'Inter'}
              color={'text.200'}
            >
              {title || 'Sample'} quiz
            </Text>
          </Box>
          <Box>
            <Text
              fontSize={'16px'}
              fontFamily={'Inter'}
              color={'text.400'}
              textAlign={'center'}
            >
              You have {count || 0} question{count > 0 ? 's' : ''}, test your
              knowledge on your <br />
              {title} quiz
            </Text>
          </Box>
        </VStack>
        <HStack
          w={'100%'}
          sx={{
            marginTop: 'auto !important'
          }}
          justifyContent={'center'}
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
            onClick={startQuiz}
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
  );
};

const QuizCard = ({
  type,
  options,
  question,
  showNextButton,
  handleNext,
  handlePrevious,
  answer,
  handleSetScore,
  handleStoreQuizHistory,
  showPreviousButton,
  _id,
  index,
  quizScores,
  handleViewResult,
  actionable = true
}: {
  actionable?: boolean;
  question?: string;
  type?: string;
  index?: number;
  title?: string;
  options?: { content: string; isCorrect: boolean }[];
  showNextButton?: boolean;
  handleNext?: () => void;
  handlePrevious?: () => void;
  answer?: string;
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
  _id?: string | number;
  showPreviousButton?: boolean;
  handleDropAnswer?: (idx: number) => void;
  quizScores:
    | any
    | {
        questionIdx: string | number;
        score: string | 'true' | 'false' | boolean | null;
        selectedOptions: string[];
        questionId?: string;
      }[];
  handleViewResult?: () => void;
}) => {
  const [optionAnswer, setOptionAnswer] = useState('');
  const [optionCheckboxAnswers, setOptionCheckboxAnswers] = useState([]);
  const [enteredAnswer, setEnteredAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showOpenEnded, setShowOpenEnded] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isEmpty(optionAnswer)) {
        const [_, index, questionIdx] = split(optionAnswer, ':');
        if (options) {
          const { isCorrect } = options[toNumber(index)];

          const score = toString(isCorrect) === 'true' ? 'true' : 'false';

          handleSetScore(
            score,
            toNumber(questionIdx),
            [optionAnswer],
            _id as string
          );
          handleStoreQuizHistory(_id as string, toString(isCorrect));
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionAnswer]);

  useEffect(() => {
    (async () => {
      if (!isEmpty(optionCheckboxAnswers)) {
        let questionIdx = '';
        const answers = [];
        forEach(optionCheckboxAnswers, (answer) => {
          const [, index, qIdx] = split(answer, ':');
          const { isCorrect } = options[toNumber(index)];
          if (!isNil(options) && !isEmpty(options)) {
            if (toString(isCorrect) === 'true') {
              questionIdx = qIdx;
              answers.push(true);
            }
          }
        });
        const answer = isEmpty(answers) ? 'false' : 'true';
        handleSetScore(
          answer,
          toNumber(questionIdx),
          optionCheckboxAnswers,
          _id as string
        );
        handleStoreQuizHistory(_id as string, answer);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionCheckboxAnswers]);

  useEffect(() => {
    if (!isEmpty(enteredAnswer)) {
      handleSetScore('null', toNumber(index), [enteredAnswer], _id as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteredAnswer]);

  let inputs = null;

  if (type === OPEN_ENDED) {
    inputs = (
      <>
        {true && (
          <Box mt={2} w={'100%'} mb="24px">
            <Textarea
              h={'32px'}
              maxHeight={'40px'}
              p={'12px 14px'}
              border={'none'}
              borderBottom={'1px'}
              borderRadius={'0px'}
              onChange={(e) => setEnteredAnswer(e.target.value)}
              value={enteredAnswer || first(quizScores[index]?.selectedOptions)}
              // isDisabled={showAnswer}
            />
          </Box>
        )}
        {!actionable && (
          <Box
            mt={'24px'}
            w={'100%'}
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
          >
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

            <Box display={'flex'} flexGrow={1}>
              <Textarea
                maxH={'40px'}
                h={'32px'}
                w={'100%'}
                p={'8px 10px'}
                isReadOnly
                value={answer}
              />
            </Box>
          </Box>
        )}

        {false && showAnswer && (
          <Box
            mt={'24px'}
            w={'100%'}
            display={'flex'}
            justifyContent={'flex-start'}
            alignItems={'flex-start'}
          >
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

            <Box display={'flex'} flexGrow={1}>
              <Textarea
                maxH={'40px'}
                h={'32px'}
                w={'100%'}
                p={'8px 10px'}
                isReadOnly
                value={answer}
              />
            </Box>
          </Box>
        )}
      </>
    );
  }

  if (type === MULTIPLE_CHOICE_MULTI) {
    inputs = (
      <CheckboxGroup
        onChange={(e) => {
          setOptionCheckboxAnswers(e);
        }}
        value={quizScores[index]?.selectedOptions}
      >
        <Stack direction="column" mb="24px">
          {isArray(options) &&
            map(options, (option, optionIndex) => (
              <Box
                className="font-[Inter] text-dark font-[400] text-[12px] leading-[19px] flex justify-start items-center cursor-pointer"
                key={optionIndex}
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                px={'8px'}
                sx={{
                  margin: '0px !important',
                  marginBottom: '4px !important'
                }}
                minH={'40px'}
                borderRadius={'8px'}
                w={'100%'}
                border={!actionable && option.isCorrect && '1px solid #66BD6A'}
                bg={!actionable && option.isCorrect && '#F1F9F1'}
              >
                <Checkbox
                  value={`question:${optionIndex}:${index}`}
                  id={`option${optionIndex}`}
                  name={`question:${optionIndex}:${index}`}
                  mr={1}
                  _disabled={{ color: 'white' }}
                >
                  {option?.content}
                </Checkbox>
              </Box>
            ))}
        </Stack>
      </CheckboxGroup>
    );
  }

  if (type === MULTIPLE_CHOICE_SINGLE) {
    inputs = (
      <RadioGroup
        onChange={(e) => {
          setOptionAnswer(e);
        }}
        value={'1'}
      >
        <Stack direction="column" mb="24px">
          {options?.map((option, optionIndex) => (
            <Box
              className="font-[Inter] text-dark font-[400] text-[12px] leading-[19px] flex justify-start items-center cursor-pointer"
              key={optionIndex}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              px={'8px'}
              sx={{
                margin: '0px !important',
                marginBottom: '4px !important'
              }}
              minH={'40px'}
              borderRadius={'8px'}
              w={'100%'}
              border={!actionable && option.isCorrect && '1px solid #66BD6A'}
              bg={!actionable && option.isCorrect && '#F1F9F1'}
            >
              <Radio
                value={
                  first(quizScores[index]?.selectedOptions) ===
                  `question:${optionIndex}:${index}`
                    ? '1'
                    : `question:${optionIndex}:${index}`
                }
                type="radio"
                id={`option${optionIndex}`}
                name={`question:${optionIndex}:${index}`}
                mr={1}
              >
                {option?.content}
              </Radio>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    );
  }

  if (type === TRUE_FALSE) {
    inputs = (
      <RadioGroup
        onChange={(e) => {
          setOptionAnswer(e);
        }}
        value={'1'}
      >
        <Stack direction="column" mb="24px">
          {options?.map((option, optionIndex) => (
            <Box
              className="font-[Inter] text-dark font-[400] text-[12px] leading-[19px] capitalize cursor-pointer"
              key={optionIndex}
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                margin: '0px !important',
                marginBottom: '4px !important'
              }}
              px={'8px'}
              minH={'40px'}
              borderRadius={'8px'}
              w={'100%'}
              border={!actionable && option.isCorrect && '1px solid #66BD6A'}
              bg={!actionable && option.isCorrect && '#F1F9F1'}
              mb={'4px'}
            >
              <Radio
                value={
                  first(quizScores[index]?.selectedOptions) ===
                  `question:${optionIndex}:${index}`
                    ? '1'
                    : `question:${optionIndex}:${index}`
                }
                type="radio"
                id={`${toLower(option.content)}-${optionIndex}`}
                name={`question:${optionIndex}:${index}`}
                mr={1}
              >
                {capitalize(option?.content)}
              </Radio>
            </Box>
          ))}
        </Stack>
      </RadioGroup>
    );
  }
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'flex-start'}
      alignItems={'center'}
      w={'100%'}
      minH={'20%'}
    >
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'flex-start'}
        bg={'whiteAlpha.900'}
        w={'90%'}
        p="16px 24px"
        borderRadius={'8px'}
      >
        <Box mb={2}>
          <Text
            fontSize={'16px'}
            fontFamily={'Inter'}
            fontWeight={'500'}
            lineHeight={'21px'}
            textColor={'text.200'}
          >
            {question}
          </Text>
        </Box>
        <Box w={'100%'} minH={'50px'}>
          {inputs}
        </Box>
      </Box>

      <Box
        position={'relative'}
        pb={actionable && '16px'}
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        flexGrow={1}
        justifyContent={'flex-end'}
        bg={'#F9F9FB'}
        mt={actionable && '64px'}
        minH={'40px'}
        w={'90%'}
      >
        {/* open ended buttons */}

        {!actionable && type === OPEN_ENDED && showOpenEnded && (
          <HStack
            bg={'whiteAlpha.900'}
            py={4}
            w={'100%'}
            justifyContent={'center'}
          >
            <Button
              w={'184px'}
              variant={'unstyled'}
              bg={'#EDF7EE'}
              color={'#4CAF50'}
              mr={3}
              onClick={async () => {
                handleSetScore(
                  'true',
                  toNumber(index),
                  quizScores[index].selectedOptions,
                  _id as string
                );
                handleStoreQuizHistory(
                  _id as string,
                  first(quizScores[index].selectedOptions)
                );
                setShowOpenEnded(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <IoCheckmarkDone color="#4CAF50" />
                <Text mx={'8px'}>Got it right</Text>
              </HStack>
            </Button>
            <Button
              bg={'#FFEFE6'}
              color={'#FB8441'}
              w={'184px'}
              variant={'unstyled'}
              mr={3}
              onClick={() => {
                handleSetScore(
                  'null',
                  toNumber(index),
                  quizScores[index].selectedOptions,
                  _id as string
                );
                handleStoreQuizHistory(
                  _id as string,
                  first(quizScores[index].selectedOptions)
                );
                setShowOpenEnded(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <QuestionOutlineIcon color={'#FB8441'} />
                <Text mx={'8px'}>Didn’t remember</Text>
              </HStack>
            </Button>
            <Button
              bg={'#FEECEC'}
              color={'#F53535'}
              w={'184px'}
              variant={'unstyled'}
              mr={3}
              onClick={() => {
                handleSetScore(
                  'false',
                  toNumber(index),
                  quizScores[index].selectedOptions,
                  _id as string
                );
                handleStoreQuizHistory(
                  _id as string,
                  first(quizScores[index].selectedOptions)
                );
                setShowOpenEnded(false);
              }}
            >
              <HStack alignItems={'center'} justifyContent={'center'}>
                <IoCloseOutline color="#F53535" />
                <Text mx={'8px'}>Got it wrong</Text>
              </HStack>
            </Button>
          </HStack>
        )}

        <HStack>
          {actionable && showPreviousButton && (
            <Button
              bg={'blue.200'}
              w={'184px'}
              colorScheme="blue"
              onClick={() => {
                setTimeout(() => {
                  handlePrevious();
                  setOptionAnswer('');
                  setOptionCheckboxAnswers([]);
                });
              }}
            >
              Previous Question
            </Button>
          )}
          {actionable && showNextButton && (
            <Button
              bg={'blue.200'}
              w={'184px'}
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (isNil(quizScores[index])) {
                  handleSetScore(
                    'null',
                    toNumber(index),
                    [],
                    (_id || '') as string
                  );
                  handleStoreQuizHistory(_id as string, '_');
                }
                setTimeout(() => {
                  handleNext();
                  setOptionAnswer('');
                  setOptionCheckboxAnswers([]);
                });
              }}
            >
              Next Question
            </Button>
          )}

          {actionable && !showNextButton && (
            <Button
              bg={'blue.200'}
              w={'184px'}
              colorScheme="blue"
              mr={3}
              onClick={handleViewResult}
            >
              View Results
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

const QuizEnd = ({
  handleReviewQuiz,
  handleRestartQuiz,
  passed = 40,
  failed = 20,
  skipped = 40,
  scores
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
          ['#F53535', 'Got it wrong', `${failed}%`]
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
  isOpen,
  closeOnOverlayClick = false,
  size = '800px'
}: {
  isOpen: boolean;
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  size?: string;
  questionType?: string;
  options?: string[];
  question?: string;
  index?: number | string;
}) => {
  const resultsBottomRef = useRef(null);
  const { quiz, loadQuiz } = quizStore();
  const navigate = useNavigate();
  const [startQuiz, setStartQuiz] = useState(false);
  const [endQuiz, setEndQuiz] = useState(false);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [scores, setScores] = useState<
    {
      questionIdx: string | number;
      score: string | 'true' | 'false' | boolean | null;
      selectedOptions: string[];
      questionId: string;
    }[]
  >([]);

  const [viewQuizAnswer, setViewQuizAnswer] = useState(false);

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

  const handleStartQuiz = () => setStartQuiz(true);
  const handleStoreQuizHistory = async (
    questionId = '',
    answerProvided = '',
    quizId = quiz?._id
  ) => {
    await ApiService.storeQuizHistory({
      questionId,
      answerProvided,
      quizId
    });
  };
  const handleDropAnswer = (idx = null) => {
    const newScores = filter(scores, (score) => {
      return !isNil(idx) && score?.questionIdx !== toNumber(idx);
    });

    setScores(newScores);
  };
  const handleNext = () => {
    setQuizCount(quizCount + 1);
  };
  const handlePrevious = () => {
    const idx = quizCount - 1;
    // const score = scores[idx]

    // setO
    setQuizCount(idx);
  };
  const handleRestartQuiz = () => {
    setQuizCount(0);
    setScores([]);
    setStartQuiz(true);
    setEndQuiz(false);
  };
  const handleReviewQuiz = () => {
    loadQuiz(null);
    navigate(`/dashboard/quizzes/create?quiz_id=${quiz?._id}`);
  };

  const handleSubmit = async () => {
    try {
      setStartQuiz(false);
      // setViewQuizAnswer(true);
      await ApiService.storeQuizScore({
        quizId: quiz._id,
        score: itemSize(filter(scores, ['score', 'true'])),
        scoreDetails: scores
      });
    } catch (error) {
      // console.log('error ========>> ', error);
    }
  };
  // useEffect(() => {
  //   if (scores.length === quiz?.questions?.length) {
  //     setTimeout(() => {
  //       (async () => {
  //         try {
  //           setStartQuiz(false);
  //           setViewQuizAnswer(true);
  //           await ApiService.storeQuizScore({
  //             quizId: quiz._id,
  //             score: itemSize(filter(scores, ['score', 'true']))
  //           });
  //         } catch (error) {
  //           console.log('error ========>> ', error);
  //         }
  //       })();
  //     }, 100);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [quiz?.questions?.length, scores]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => loadQuiz(null)}
      closeOnOverlayClick={closeOnOverlayClick}
      size={size}
    >
      <ModalOverlay />
      <ModalContent w={'740px'} h={'510px'}>
        {!startQuiz || endQuiz ? <ModalCloseButton /> : null}
        {startQuiz && (
          <>
            <ModalHeader bg={'#F9F9FB'}>
              <HStack
                p={'24px 30px 0px'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Text>Study Session</Text>
                <Button
                  onClick={() => loadQuiz(null)}
                  bg={'red.400'}
                  w={'124px'}
                  h={'34px'}
                  _hover={{ bg: 'red.200' }}
                >
                  End
                </Button>
              </HStack>
            </ModalHeader>
            <Progress
              h={'2px'}
              value={
                toNumber(quiz?.questions?.length) === 1
                  ? 100
                  : toNumber(quiz?.questions?.length) < 3 && quizCount === 0
                  ? 50
                  : quizCount === toNumber(quiz?.questions?.length) - 1
                  ? 100
                  : (quizCount / toNumber(quiz?.questions?.length)) * 100
              }
              colorScheme="blue"
            />
          </>
        )}

        <ModalBody
          p={endQuiz ? '0px' : ''}
          pb={endQuiz ? '0px' : ''}
          bg={endQuiz ? '#E1EEFE' : '#F9F9FB'}
        >
          <Box
            h={'100%'}
            w={'100%'}
            display={'flex'}
            alignItems={'flex-start'}
            justifyContent={'center'}
          >
            {!startQuiz && !endQuiz && !viewQuizAnswer && (
              <QuizLanding
                {...{ ...quiz, count: quiz?.questions?.length }}
                startQuiz={handleStartQuiz}
              />
            )}
            {startQuiz && quiz && (
              <QuizCard
                quizScores={[...scores]}
                handleStoreQuizHistory={handleStoreQuizHistory}
                handleSetScore={handleSetScore}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
                showNextButton={
                  quizCount < toNumber(quiz?.questions?.length) - 1
                }
                showPreviousButton={quizCount > 0}
                {...{
                  ...quiz,
                  ...quiz?.questions[quizCount],
                  index: quizCount,
                  actionable: true
                }}
                handleDropAnswer={handleDropAnswer}
                handleViewResult={() => {
                  setStartQuiz(false);
                  setViewQuizAnswer(true);
                }}
              />
            )}

            {viewQuizAnswer && (
              <Box
                w={'100%'}
                h={'100%'}
                pt={'40px'}
                pb={'24px'}
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'flex-start'}
                position={'relative'}
              >
                <Box className="font-[Inter] text-lg font-bold">
                  <HStack justifyContent={'center'}>
                    <Text>View Quiz Answers</Text>
                  </HStack>
                </Box>

                <Box w={'100%'} my={'auto'} maxH={'300px'} overflowY={'auto'}>
                  {map(quiz?.questions, (question, index) => (
                    <Box w={'100%'} minH={'10px'} mb={6}>
                      <QuizCard
                        handleStoreQuizHistory={handleStoreQuizHistory}
                        handleSetScore={handleSetScore}
                        quizScores={[...scores]}
                        {...{
                          ...question,
                          index,
                          actionable: false
                        }}
                      />
                    </Box>
                  ))}
                  <Box ref={resultsBottomRef} p={2} />
                </Box>

                <Box>
                  <HStack justifyContent={'center'}>
                    <Button
                      bg={'blue.200'}
                      w={'184px'}
                      colorScheme="blue"
                      mr={3}
                      onClick={() => {
                        setEndQuiz(true);
                        setViewQuizAnswer(false);
                        handleSubmit();
                      }}
                    >
                      Continue
                    </Button>
                  </HStack>
                </Box>
                <Box position={'absolute'} bottom={'20%'} right={0}>
                  <Button
                    p={0}
                    borderWidth={'2px'}
                    borderColor={'gray.100'}
                    bg={'whiteAlpha.900'}
                    textColor={'blue.200'}
                    w={'40px'}
                    h={'40px'}
                    borderRadius={'8px'}
                    _hover={{
                      bg: 'blue.500',
                      textColor: 'whiteAlpha.900',
                      borderColor: 'blue.500'
                    }}
                    onClick={() => {
                      resultsBottomRef.current?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <IoChevronDown className="w-[24px] h-[24px]" />
                  </Button>
                </Box>
              </Box>
            )}

            {endQuiz && (
              <QuizEnd
                scores={[...scores]}
                handleRestartQuiz={handleRestartQuiz}
                handleReviewQuiz={handleReviewQuiz}
                passed={Math.floor(
                  toNumber(
                    (itemSize(filter([...scores], ['score', 'true'])) /
                      toNumber(quiz?.questions?.length)) *
                      100
                  )
                )}
                failed={Math.floor(
                  toNumber(
                    (itemSize(filter([...scores], ['score', 'false'])) /
                      toNumber(quiz?.questions?.length)) *
                      100
                  )
                )}
                skipped={Math.floor(
                  toNumber(
                    (itemSize(filter([...scores], ['score', 'null'])) /
                      toNumber(quiz?.questions?.length)) *
                      100
                  )
                )}
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;
