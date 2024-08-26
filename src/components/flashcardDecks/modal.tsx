import { RiRemoteControlLine } from '@remixicon/react';
import FlashcardEmpty from '../../assets/flashcard_empty_state.png';
import StudySessionLogger from '../../helpers/sessionLogger';
import { useSearchQuery } from '../../hooks';
import flashcardStore from '../../state/flashcardStore';
import {
  FlashcardData,
  Score,
  Study,
  MinimizedStudy,
  SessionType
} from '../../types';
import ShepherdSpinner from '../../views/Dashboard/components/shepherd-spinner';
import PlansModal from '../PlansModal';
import DailyDeckSelector from './dailyDeckSelector';
import FlashCard from './deck_two';
import DeckOverLap from './overlap';
import ResultDisplay from './resultDisplay';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Modal,
  Icon,
  ModalOverlay,
  ModalContent,
  MenuItem,
  MenuList,
  MenuButton,
  ModalHeader,
  Menu,
  MenuGroup,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react';
import _ from 'lodash';
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react';
import { AiFillThunderbolt } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FiCheck, FiHelpCircle, FiXCircle } from 'react-icons/fi';
import styled from 'styled-components';
import { useCustomToast } from '../CustomComponents/CustomToast/useCustomToast';
import { useNavigate } from 'react-router';
import userStore from '../../state/userStore';
import { MdCancel } from 'react-icons/md';

const MenuListWrapper = styled(MenuList)`
  .chakra-menu__group__title {
    margin: 0 !important;
  }
`;

let INITIAL_TIMER = 0;

const LoaderOverlay = () => (
  <div
    style={{
      position: 'absolute',
      zIndex: 1,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)' // Semi-transparent background
    }}
  >
    <ShepherdSpinner />
  </div>
);

const StudyFooter = ({
  showMinimize = false,
  onMinimize
}: {
  showMinimize?: boolean;
  onMinimize?: () => void;
}) => {
  const { loadFlashcard, flashcard } = flashcardStore();

  const renderTag = () => {
    return [...(flashcard?.tags || [])].splice(0, 3).map((tag) => (
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
          onClick={() => loadFlashcard(null, false)}
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

const EmptyState = ({
  onStart,
  flashcard,
  onClose
}: {
  onStart: () => void;
  flashcard: FlashcardData;
  onClose: () => void;
}) => {
  return (
    <Box
      borderRadius="12px"
      minWidth={{ base: '80%', md: '600px' }}
      display={'flex'}
      height="500px"
      flexDirection={'column'}
      width="100%"
      justifyContent={'center'}
      alignItems={'center'}
    >
      <img
        style={{ width: '100px', height: '100px' }}
        src={FlashcardEmpty}
        alt="flash_card_emtpy"
      />

      <Text
        color="#212224"
        fontFamily="Inter"
        fontSize="24px"
        mt="10px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="30px"
        letterSpacing="-0.48px"
      >
        {flashcard?.deckname} Flashcards
      </Text>
      <Text
        color="#6E7682"
        fontFamily="Inter"
        width="60%"
        fontSize="16px"
        mt="10px"
        fontStyle="normal"
        fontWeight="400"
        lineHeight="21px"
        textAlign={'center'}
        letterSpacing="-0.048px"
      >
        You have {flashcard?.questions?.length} question
        {flashcard?.questions?.length > 1 ? 's' : ''} , test your knowledge on
        your {flashcard?.deckname} flashcards
      </Text>

      <Button
        bg="#207DF7"
        width={'80%'}
        color="white"
        mt="50px"
        borderRadius="8px"
        onClick={() => onStart()}
        border="1px solid #207DF7"
        padding="25px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Text
          fontSize="14px"
          fontWeight="500"
          lineHeight="22px"
          textAlign="center"
        >
          Study
        </Text>
      </Button>
      {/* <Box
        display={'flex'}
        flexDirection={'column'}
        width="100%"
        height={'100%'}
        justifyContent={'center'}
        alignItems={'center'}
      >
       
      </Box>
      <StudyFooter /> */}
    </Box>
  );
};

const CompletedState = ({
  onDone,
  score,
  onRefresh
}: {
  onDone: () => void;
  score: Score;
  onRefresh: () => void;
}) => {
  const calculatePercentages = (score: Score) => {
    const { passed, failed, notRemembered } = score;
    const total = passed + failed + notRemembered;

    const passPercentage = Math.floor((passed / total) * 100);
    const failPercentage = Math.floor((failed / total) * 100);
    const notRememberedPercentage = 100 - passPercentage - failPercentage;

    return {
      passPercentage,
      failPercentage,
      notRememberedPercentage
    };
  };
  const { passPercentage, failPercentage, notRememberedPercentage } =
    calculatePercentages(score);

  const { dailyFlashcards, setShowStudyList } = flashcardStore();
  const title =
    Number(passPercentage) >= 85 ? 'Congratulations!' : "Let's keep studying!";
  return (
    <Box
      borderRadius="12px"
      minWidth={{ base: '80%', md: '600px' }}
      display={'flex'}
      height="500px"
      flexDirection={'column'}
      width="100%"
      background={'#F6F6F9'}
      justifyContent={'start'}
      alignItems={'center'}
    >
      <Box width="100%" background="#E1EEFE" height="50%"></Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        width="100%"
      >
        <Text
          color="#212224"
          fontFamily="Inter"
          fontSize="16px"
          mt="15px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="30px"
          letterSpacing="-0.48px"
        >
          {title}
        </Text>
        <Text
          color="#6E7682"
          fontFamily="Inter"
          width="60%"
          fontSize="16px"
          mt="15px"
          fontStyle="normal"
          fontWeight="400"
          lineHeight="21px"
          textAlign={'center'}
          letterSpacing="-0.048px"
        >
          You reviewed all cards, what would you like to do next?
        </Text>
        <Box
          mt="15px"
          display={'flex'}
          justifyContent={'space-between'}
          width={'70%'}
        >
          <ResultDisplay
            score={passPercentage}
            badgeText={'Got it right'}
            badgeColor="#4CAF50"
          />
          <ResultDisplay
            score={failPercentage}
            badgeText={'Didn’t remember'}
            badgeColor="#FB8441"
          />
          <ResultDisplay
            score={notRememberedPercentage}
            badgeText={'Got it wrong'}
            badgeColor="#F53535"
          />
        </Box>

        <HStack
          width="100%"
          padding="0px 5%"
          direction="column"
          alignItems="center"
          mt="50px"
        >
          <Button
            width={dailyFlashcards?.length ? '50%' : '100%'} // Conditionally set width
            onClick={() => onRefresh()}
            borderRadius="8px"
            background={'rgb(32, 125, 247)'}
            color={'#fff'}
            _hover={{ background: 'none' }}
            padding="25px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize="14px"
              color="#fff"
              fontWeight="500"
              lineHeight="22px"
              textAlign="center"
            >
              Restart Flashcard
            </Text>
          </Button>
          {dailyFlashcards?.length > 0 && ( // Check if dailyFlashcards has items
            <Button
              bg="#fff"
              width={'50%'}
              color="#000"
              onClick={() => setShowStudyList(true)}
              borderRadius="8px"
              _hover={{ background: 'none' }}
              border="1px solid #E7E8E9"
              padding="25px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="14px"
                color="#000"
                fontWeight="500"
                lineHeight="22px"
                textAlign="center"
              >
                Select Another Card
              </Text>
            </Button>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

let studySessionLogger: StudySessionLogger | undefined = undefined;

const StudyBox = () => {
  const [studyState, setStudyState] = useState<'question' | 'answer'>(
    'question'
  );
  // here gotta go fetch with the ID imo or ideally /flashcards/:id should fetch there
  // or create a brand new empty component
  const {
    flashcard,
    storeScore,
    updateQuestionAttempt,
    minorLoader,
    minimizedStudy,
    isLoading,
    cloneFlashcard,
    loadFlashcard,
    storeCurrentStudy,
    loadTodaysFlashcards
  } = flashcardStore();
  const { user, hasActiveSubscription }: any = userStore();
  const toast = useCustomToast();
  const navigate = useNavigate();
  const apiKey = window.location.href.includes('apiKey');
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0);
  const [studyType, setStudyType] = useState<'manual' | 'timed'>('manual');
  const [{ isStarted, isFinished }, setActivityState] = useState({
    isStarted: false,
    isFinished: false
  });
  const [progressWidth, setProgressWidth] = useState('100%');
  const [studies, setStudies] = useState<Study[]>([] as Study[]);
  const [cardStyle, setCardStyle] = useState<'flippable' | 'default'>(
    'default'
  );
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const [savedScore, setSavedScore] = useState<Score>({
    score: 0,
    failed: 0,
    passed: 0,
    notRemembered: 0,
    questionsPassed: [],
    questionsFailed: [],
    questionsNotRemembered: []
  } as Score);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);

  useEffect(() => {
    if (minimizedStudy) {
      setSavedScore(minimizedStudy.data.savedScore);
      setCardStyle(minimizedStudy.data.cardStyle);
      setActivityState({
        isStarted: minimizedStudy.data.isStarted,
        isFinished: minimizedStudy.data.isFinished
      });
      setProgressWidth(minimizedStudy.data.progressWidth);
      setCurrentStudyIndex(minimizedStudy.data.currentStudyIndex);
      setStudyType(minimizedStudy.data.studyType);
      setStudyState(minimizedStudy.data.studyState);
      setStudies(minimizedStudy.data.studies);
    }
  }, [minimizedStudy]);

  useEffect(() => {
    return () => {
      if (studySessionLogger && studySessionLogger.currentState !== 'ENDED') {
        studySessionLogger.end();
      }
    };
  }, []);

  const minimizeStudy = async () => {
    const data: MinimizedStudy = {
      flashcardId: flashcard?._id as string,
      data: {
        currentStudyIndex,
        studyType,
        isStarted,
        isFinished,
        progressWidth,
        studies,
        cardStyle,
        timer,
        savedScore,
        studyState
      }
    };
    if (flashcard) {
      await storeCurrentStudy(flashcard?._id, data);
      loadFlashcard(null, false);
    }
  };

  const restartStudy = () => {
    setSavedScore({
      score: 0,
      failed: 0,
      passed: 0,
      notRemembered: 0,
      questionsPassed: [],
      questionsFailed: [],
      questionsNotRemembered: []
    } as Score);
    setCardStyle('default');
    setActivityState({ isStarted: false, isFinished: false });
    setProgressWidth('100%');
    setCurrentStudyIndex(0);
    setStudyType('manual');
    setStudyState('question');
    if (flashcard) {
      setStudies(formatFlashcard(flashcard));
    }
  };

  const formatFlashcard = useCallback(
    (flashcard: any) => {
      const formatedQuestions: Study[] = flashcard.questions.map(
        (question, index) => {
          const data: Study = {
            id: index + 1,
            type: studyType,
            questions: question.question,
            questionId: question._id,
            answers: question.answer,
            currentStep: question.currentStep,
            explanation: question.explanation,
            helperText: question.helperText,
            numberOfAttempts: question.numberOfAttempts,
            isFirstAttempt: question.numberOfAttempts === 0
          };
          if (question.options || question.questionType === 'trueFalse') {
            if (question.questionType === 'trueFalse') {
              data.options = {
                type: 'single',
                content: ['true', 'false']
              };
            } else {
              if (question.options?.length) {
                data.options = {
                  type: 'single',
                  content: question?.options
                };
              }
            }
          }
          return data;
        }
      );
      return formatedQuestions;
    },
    [studyType]
  );

  useEffect(() => {
    if (flashcard) {
      setStudies(formatFlashcard(flashcard));
    }
  }, [flashcard, studyType, formatFlashcard]);

  const currentStudy = useMemo(
    () => studies[currentStudyIndex],
    [currentStudyIndex, studies]
  );

  useEffect(() => {
    setStudyState('question');
    setProgressWidth('100%');
  }, [currentStudyIndex]);

  const saveScore = useCallback(async () => {
    if (flashcard) await storeScore(flashcard?._id, savedScore);
  }, [flashcard, storeScore, savedScore]);

  useEffect(() => {
    if (isFinished) {
      saveScore();
      if (studySessionLogger) {
        studySessionLogger.end();
      }
    }
  }, [isFinished, saveScore]);

  const lazyTriggerNextStep = async () => {
    if (currentStudyIndex === studies.length - 1) {
      setTimeout(() => {
        finishStudy();
      }, 2000);
      // if (flashcard) await storeScore(flashcard?._id, correctAnswerCount);
    } else {
      setTimeout(() => setCurrentStudyIndex((prev) => prev + 1), 2000);
    }
  };

  useEffect(() => {
    let countdown;
    if (INITIAL_TIMER === 0) {
      INITIAL_TIMER = timer;
    }

    if (isStarted && studyType === 'timed') {
      countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          // Calculate progress bar width
          const newWidth = `${(newTimer / INITIAL_TIMER) * 100}%`;
          setProgressWidth(newWidth);
          return newTimer;
        });
      }, 1000);
    }

    if (timer === 0 && studyType === 'timed' && studyState === 'question') {
      setTimer(INITIAL_TIMER);
      INITIAL_TIMER = 0;
      clearInterval(countdown);
      setStudyState('answer');
    } else if (studyState === 'answer') {
      setTimer(INITIAL_TIMER);
      INITIAL_TIMER = 0;
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [isStarted, timer, studyType, studyState]);

  const acceptAnswer = async () => {
    if (flashcard && !apiKey) {
      updateQuestionAttempt(
        flashcard._id,
        currentStudy.questions,
        true,
        'got it right'
      );
      loadTodaysFlashcards();
    }

    setStudies((prev) => {
      const curr = prev[currentStudyIndex];
      curr.currentStep = curr.currentStep + 1;
      prev[currentStudyIndex] = curr;
      setSavedScore((prevScore) => {
        return {
          ...prevScore,
          score: (prevScore.score || 0) + 1,
          passed: (prevScore.passed || 0) + 1,
          questionsPassed: [
            ...(prevScore.questionsPassed || []),
            currentStudy.questionId
          ]
        };
      });
      setCorrectAnswerCount((prev) => prev + 1);
      return [...prev];
    });
    if (currentStudyIndex === 2 && apiKey) {
      setTogglePlansModal(true);
      return;
    }
    lazyTriggerNextStep();
  };

  const rejectAnswer = async (notRemembered?: boolean) => {
    const scoreKey = notRemembered ? 'notRemembered' : 'failed';
    const questionArrayKey = notRemembered
      ? 'questionsNotRemembered'
      : 'questionsFailed';

    if (flashcard && !apiKey) {
      const grade = notRemembered ? 'did not remember' : 'got it wrong';
      updateQuestionAttempt(
        flashcard._id,
        currentStudy.questions,
        false,
        grade
      );
      loadTodaysFlashcards();
    }

    setStudies((prev) => {
      const curr = prev[currentStudyIndex];
      curr.isFirstAttempt = false;
      prev[currentStudyIndex] = curr;

      setSavedScore((prevScore) => {
        return {
          ...prevScore,
          [scoreKey]: (prevScore[scoreKey] || 0) + 1,
          [questionArrayKey]: [
            ...(prevScore[questionArrayKey] || []),
            currentStudy.questionId
          ]
        };
      });
      return [...prev];
    });

    if (currentStudyIndex === 2 && apiKey) {
      setTogglePlansModal(true);
      return;
    }
    lazyTriggerNextStep();
  };

  const cloneFlashcardHandler = async () => {
    const flashcardId = flashcard._id;

    const cloned = await cloneFlashcard(flashcardId);
    if (cloned) {
      toast({
        position: 'top-right',
        title: `Flashcard Cloned Succesfully`,
        status: 'success'
      });
      setTimeout(() => {
        navigate(`/dashboard/flashcards/${cloned._id}/edit`);
      }, 200);
    } else {
      toast({
        position: 'top-right',
        title: `Problem cloning flashcard, please try again later!`,
        status: 'error'
      });
    }
  };

  const startStudy = () => {
    setActivityState((prev) => ({
      ...prev,
      isStarted: !prev.isStarted
    }));
    studySessionLogger = new StudySessionLogger(SessionType.FLASHCARD);
    studySessionLogger.start();
  };

  const finishStudy = () => {
    setActivityState((prev) => ({
      isStarted: false,
      isFinished: true
    }));
  };

  const questionsLeft = (
    <Box
      position="relative"
      width="22px"
      height="22px"
      borderRadius="22px"
      border="1px solid rgba(255, 255, 255, 0.15)"
      background="rgba(255, 255, 255, 0.15)"
      color="#FFF"
      fontSize="12px"
      fontFamily="Inter"
      fontWeight="600"
      lineHeight="17px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top="-1px"
        left="-1px"
        width={`${progressWidth}%`}
        height="100%"
        border="1px solid rgba(255, 255, 255, 0.5)"
        borderRadius="22px"
        zIndex="-1"
      />
      {studies.length - currentStudyIndex - 1}
    </Box>
  );
  const renderMainBox = () => {
    return isFinished ? (
      <CompletedState
        onRefresh={() => restartStudy()}
        onDone={() => loadFlashcard(null, false)}
        score={savedScore}
      />
    ) : (
      <Box width="100%" flexDirection={'column'} display={'flex'}>
        <Box width="100%" height="500px">
          <Box
            position="absolute"
            top="150px"
            left="50%"
            transform="translateX(-50%)"
            width="340px"
            height="385px"
            fontSize="sub3Size"
            color="text.400"
          >
            <DeckOverLap
              top="30px"
              left="50%"
              width="256px"
              height="355px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === 'answer' ? '#F9FAFB' : '#fff'}
            >
              {/* Content for frame-child5 */}
            </DeckOverLap>
            <DeckOverLap
              top="20px"
              left="50%"
              width="284px"
              height="355px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === 'answer' ? '#F9FAFB' : '#fff'}
            >
              {/* Content for frame-child6 */}
            </DeckOverLap>
            <DeckOverLap
              top="10px"
              left="50%"
              width="312px"
              height="355px"
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              backgroundColor={studyState === 'answer' ? '#F9FAFB' : '#fff'}
            >
              {/* Content for frame-child7 */}
            </DeckOverLap>

            <FlashCard
              cardStyle={cardStyle}
              study={currentStudy}
              onNewResult={(selectedOpions) => {
                const isCorrect =
                  typeof currentStudy.answers === 'string'
                    ? currentStudy.answers === selectedOpions
                    : _.isEqual(currentStudy.answers, selectedOpions);
                isCorrect ? acceptAnswer() : rejectAnswer();
              }}
              studyState={studyState}
              position="absolute"
              top="0"
              borderRadius="5px"
              background={
                studyState === 'answer' || cardStyle === 'default'
                  ? '#F9FAFB'
                  : '#fff'
              }
              boxShadow="0 6px 24px rgba(92, 101, 112, 0.15)"
              height="355px"
              overflow="hidden"
              left="50%"
              transform="translateX(-50%)"
              width="340px"
            />
          </Box>
        </Box>

        {studyState === 'question' ? (
          <Box
            width={'100%'}
            display="flex"
            justifyContent={'center'}
            px="30px"
            pb="40px"
          >
            <Button
              onClick={() => {
                setStudyState('answer');
                // if(currentStudy.options){
                //     lazyTriggerNextStep()
                // }
              }}
              isLoading={minorLoader}
              bg="#207DF7"
              width={'80%'}
              color="white"
              _loading={{
                background: '#207DF7',
                color: 'white'
              }}
              borderRadius="8px"
              border="1px solid #207DF7"
              height="48px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="14px"
                fontWeight="500"
                lineHeight="22px"
                textAlign="center"
              >
                Show Answer
              </Text>
            </Button>
          </Box>
        ) : (
          !currentStudy?.options && (
            <Box
              width="100%"
              display={{ base: 'block', md: 'flex' }}
              justifyContent="space-between"
              px="20px"
              pb="40px"
              fontSize={{ base: '0.75rem', md: '1rem' }}
            >
              <Button
                leftIcon={<Icon as={FiCheck} fontSize={'16px'} />}
                borderRadius="8px"
                isLoading={minorLoader}
                _loading={{
                  background: '#EDF7EE',
                  color: '#4CAF50'
                }}
                onClick={() => {
                  acceptAnswer();
                  // setStudies(prev => {
                  //     const curr = prev[currentStudyIndex]
                  //     curr.currentStep = curr.currentStep + 1
                  //     prev[currentStudyIndex] = curr
                  //     return [...prev]
                  // })
                  // setCorrectAnswerCount(prev => prev + 1)
                  // lazyTriggerNextStep()
                }}
                flex="1"
                fontSize="16px"
                backgroundColor="#EDF7EE"
                padding="16.5px 45.5px 16.5px 47.5px"
                boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
                color="#4CAF50"
                marginRight={{ md: '10px' }}
                marginBottom={{ base: '15px' }}
                loadingText="Got it right"
                height="54px"
                width={{ base: '100%', md: 'auto' }}
                transition="transform 0.3s"
                _hover={{
                  background: '#EDF7EE',
                  transform: 'scale(1.05)'
                }}
              >
                Got it right
              </Button>

              <Button
                leftIcon={<Icon as={FiHelpCircle} fontSize={'16px'} />}
                borderRadius="8px"
                padding="16.5px 45.5px 16.5px 47.5px"
                backgroundColor="#FFEFE6"
                isLoading={minorLoader}
                color="#FB8441"
                flex="1"
                fontSize="16px"
                marginRight={{ md: '10px' }}
                marginBottom={{ base: '15px' }}
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  rejectAnswer(true);
                }}
                height="54px"
                _loading={{
                  background: '#FFEFE6',
                  color: '#FB8441'
                }}
                loadingText="Didn’t remember"
                transition="transform 0.3s"
                _hover={{
                  background: '#FFEFE6',
                  transform: 'scale(1.05)'
                }}
                disabled={isLoading}
              >
                Didn’t remember
              </Button>

              <Button
                leftIcon={<Icon as={FiXCircle} fontSize={'16px'} />}
                display="flex"
                padding="16.5px 45.5px 16.5px 47.5px"
                justifyContent="center"
                isLoading={minorLoader}
                alignItems="center"
                borderRadius="8px"
                fontSize="16px"
                marginBottom={{ base: '15px' }}
                backgroundColor="#FEECEC"
                color="#F53535"
                flex="1"
                height="54px"
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  rejectAnswer();
                }}
                loadingText="Got it wrong"
                _loading={{
                  background: '#FEECEC',
                  color: '#F53535'
                }}
                transition="transform 0.3s"
                _hover={{
                  background: '#FEECEC',
                  transform: 'scale(1.05)'
                }}
                disabled={isLoading}
              >
                Got it wrong
              </Button>
              {user && hasActiveSubscription && apiKey && (
                <Button
                  leftIcon={<Icon as={RiRemoteControlLine} fontSize={'16px'} />}
                  display="flex"
                  padding="16.5px 45.5px 16.5px 47.5px"
                  justifyContent="center"
                  isLoading={minorLoader}
                  alignItems="center"
                  borderRadius="8px"
                  fontSize="16px"
                  marginBottom={{ base: '15px' }}
                  backgroundColor="#FEECEC"
                  color="#000"
                  flex="1"
                  className="ml-3"
                  height="54px"
                  width={{ base: '100%', md: 'auto' }}
                  onClick={cloneFlashcardHandler}
                  loadingText="Clone Flashcard"
                  transition="transform 0.3s"
                  _hover={{
                    background: '#FEECEC',
                    transform: 'scale(1.05)'
                  }}
                  disabled={isLoading}
                >
                  Clone Flashcard
                </Button>
              )}
            </Box>
          )
        )}
      </Box>
    );
  };

  return (
    <Box
      padding={0}
      display={{ base: 'flex', sm: 'block' }}
      justifyContent={'space-between'}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      flexDirection={'column'}
      minWidth={{ base: '80%', md: '700px' }}
      width="auto"
    >
      <Box w="100%">
        <Flex
          width="full"
          padding={{ base: '20px 15px', md: '20px' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <HStack
            spacing={4}
            alignItems="center"
            width={{ sm: '100%' }}
            marginBottom={{ sm: '15px', md: '0' }}
          >
            <Text
              fontFamily="Inter"
              fontWeight="500"
              fontSize="16px"
              lineHeight="21px"
              letterSpacing="0.7%"
              color="#212224"
            >
              Study Session
            </Text>
            <Text
              fontFamily="Inter"
              fontWeight="400"
              fontSize="12px"
              lineHeight="17px"
              color="#585F68"
              bg="#F4F5F6"
              borderRadius="4px"
              padding="8px"
            >
              {flashcard?.deckname}
            </Text>
          </HStack>
          <HStack
            spacing={4}
            alignItems="center"
            justifyContent={{ sm: 'space-between', md: 'flex-end' }}
            width={{ sm: '100%' }}
          >
            <Button
              leftIcon={
                isStarted ? (
                  questionsLeft
                ) : (
                  <AiFillThunderbolt
                    style={{ marginTop: '4px' }}
                    fontSize={'24px'}
                    color="white"
                  />
                )
              }
              padding="8px 32px"
              borderRadius="8px"
              bg={isStarted ? '#F53535' : '#207DF7'}
              color="#FFF"
              fontSize="14px"
              border="none"
              fontWeight="500"
              lineHeight="19px"
              _hover={{
                bg: isStarted ? '#F53535' : '#207DF7', // Remove hover color change
                transform: 'scale(1.05)' // Add hover size increase
              }}
              _active={{
                borderColor: 'none', // Remove active border
                boxShadow: 'none' // Remove active shadow
              }}
              onClick={() => startStudy()}
            >
              {isStarted ? 'Stop' : 'Study'}
            </Button>
            <Menu>
              <MenuButton
                as={Button}
                variant="unstyled"
                borderRadius="full"
                p={0}
                minW="auto"
                height="auto"
              >
                <BsThreeDots size="16px" />
              </MenuButton>
              <MenuListWrapper
                fontSize="14px"
                minWidth={'185px'}
                borderRadius="8px"
                backgroundColor="#FFFFFF"
                boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
              >
                <MenuGroup margin={0} title="Timer">
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={
                      INITIAL_TIMER === 5 || timer === 5 ? '#F2F4F7' : '#fff'
                    }
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setTimer(5);
                      setStudyType('timed');
                    }}
                  >
                    5 secs
                  </MenuItem>
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={
                      INITIAL_TIMER === 10 || timer === 10 ? '#F2F4F7' : '#fff'
                    }
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setTimer(10);
                      setStudyType('timed');
                    }}
                  >
                    10 secs
                  </MenuItem>
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={
                      INITIAL_TIMER === 30 || timer === 30 ? '#F2F4F7' : '#fff'
                    }
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setTimer(30);
                      setStudyType('timed');
                    }}
                  >
                    30 secs
                  </MenuItem>
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={
                      INITIAL_TIMER === 60 || timer === 60 ? '#F2F4F7' : '#fff'
                    }
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setTimer(60);
                      setStudyType('timed');
                    }}
                  >
                    1 minute
                  </MenuItem>
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={studyType === 'manual' ? '#F2F4F7' : '#fff'}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      setTimer(0);
                      setStudyType('manual');
                    }}
                  >
                    None
                  </MenuItem>
                </MenuGroup>
                <MenuGroup title="Card Style">
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={cardStyle === 'default' ? '#F2F4F7' : '#fff'}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setCardStyle('default')}
                  >
                    Default
                  </MenuItem>
                  <MenuItem
                    p="6px 8px 6px 8px"
                    pl="15px"
                    background={cardStyle === 'flippable' ? '#F2F4F7' : '#fff'}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => setCardStyle('flippable')}
                  >
                    Flippable
                  </MenuItem>
                </MenuGroup>
              </MenuListWrapper>
            </Menu>
          </HStack>
        </Flex>
        <Box position="relative" width="100%" height="2px">
          <Box
            className="progress-bar-base"
            position="absolute"
            width="100%"
            height="2px"
            bg="#EEEFF2"
            borderRadius="2px"
          />
          <Box
            className="progress-bar"
            position="absolute"
            width={progressWidth}
            height="2px"
            bg={
              timer <= 10 && isStarted && currentStudy.type === 'timed'
                ? '#F53535'
                : '#207DF7'
            }
            borderRadius="2px"
            transition="width 0.5s linear" // Add this line
          />
        </Box>
        {/* {isLoading && <LoaderOverlay />} */}
        {!isStarted && !isFinished ? (
          <EmptyState
            flashcard={flashcard as FlashcardData}
            onClose={() => loadFlashcard(null, false)}
            onStart={() => startStudy()}
          />
        ) : (
          renderMainBox()
        )}
      </Box>
      {togglePlansModal && (
        <PlansModal
          message="Up to 4 weeks free!"
          subMessage="One-click Cancel at anytime."
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
        />
      )}
      <StudyFooter
        onMinimize={() => minimizeStudy()}
        showMinimize={isStarted && !isFinished}
      />
    </Box>
  );
};

const FlashCardModal = ({ isOpen }: { isOpen: boolean }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const { showStudyList, setShowStudyList, loadFlashcard } = flashcardStore();
  const [cancelButtonTop, setCancelButtonTop] = useState(0);

  useEffect(() => {
    const modalContent = modalRef.current;
    if (modalContent) {
      const modalContentPosition = modalContent.getBoundingClientRect();
      const topOffset =
        modalContentPosition.top - modalContentPosition.height - 2;
      setCancelButtonTop(topOffset);
    }
  }, []);

  return (
    <Modal
      onClose={() => {
        if (showStudyList) {
          loadFlashcard(null, false);
          setShowStudyList(false);
        }
      }}
      isOpen={isOpen}
      isCentered
    >
      <ModalOverlay>
        <ModalContent
          // borderRadius="12px"
          // minWidth={{ base: '80%', md: '700px' }}
          // mx="auto"
          // w="fit-content"
          // position="relative"
          borderRadius="12px"
          w="full" // Use the full width of the screen
          maxW={{ base: '95%', sm: 'auto', md: '700px' }} // Responsive max width
          mx="auto"
          position="relative"
        >
          {showStudyList && (
            <ModalHeader>
              <Text fontSize="lg" fontWeight="bold" isTruncated>
                Select a card deck to study
              </Text>
            </ModalHeader>
          )}
          <div ref={modalRef}>
            {showStudyList ? <DailyDeckSelector /> : <StudyBox />}
          </div>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default FlashCardModal;
