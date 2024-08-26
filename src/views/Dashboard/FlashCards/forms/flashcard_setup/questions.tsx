import { useCustomToast } from '../../../../../components/CustomComponents/CustomToast/useCustomToast';
import { useFlashcardWizard, FlashcardQuestion } from '../../context/flashcard';
import { HStack, Textarea } from '@chakra-ui/react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const FlashCardQuestionsPage = ({ showConfirm }: { showConfirm?: boolean }) => {
  const {
    flashcardData,
    goToNextStep,
    saveFlashcardData,
    setCurrentQuestionData,
    setQuestions,
    goToQuestion,
    currentQuestionIndex,
    questions
  } = useFlashcardWizard();

  const toast = useCustomToast();

  const questionTextareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const answerTextRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [hasTriggeredSave, setHasTriggeredSave] = useState(false);

  // Set the initial height of the Textarea
  const [textareaHeight, setTextareaHeight] = useState('auto');
  // Set the initial height of the Textarea
  const [textareaAnswerHeight, setAnswerTextHeight] = useState('auto');

  useEffect(() => {
    if (questionTextareaRef.current) {
      const scrollHeight = questionTextareaRef.current.scrollHeight;
      setTextareaHeight(`${scrollHeight + 20}px`); // Add 20px to the content height
    }
  }, [currentQuestionIndex]); // Adjust height when the question changes

  useEffect(() => {
    if (answerTextRef.current) {
      const scrollHeight = answerTextRef.current.scrollHeight;
      setAnswerTextHeight(`${scrollHeight + 20}px`); // Add 20px to the content height
    }
  }, [currentQuestionIndex]); // Adjust height when the question changes

  const [currentQuestion, setCurrentQuestion] = useState<FlashcardQuestion>({
    questionType: 'openEnded',
    question: '',
    options: [],
    answer: ''
  });

  const handleDone = useCallback(
    (success: boolean) => {
      toast({
        title: success
          ? 'Flashcard questions generated successfully'
          : 'Failed to generate flashcard questions',
        position: 'top-right',
        status: success ? 'success' : 'error',
        isClosable: true
      });
    },
    [toast]
  );

  const questionVariants = {
    hidden: { x: '-100vw' },
    visible: { x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { x: '100vw', transition: { duration: 0.5, ease: 'easeInOut' } }
  };

  // Slide animations for answers:
  const answerVariants = {
    hidden: { y: '100vh' },
    visible: { y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { y: '-100vh', transition: { duration: 0.5, ease: 'easeInOut' } }
  };

  const handleSave = () => {
    handleQuestionSubmit();
    setHasTriggeredSave(true);
  };

  useEffect(() => {
    if (hasTriggeredSave) {
      const lastQuestion = questions[questions.length - 1];
      if (lastQuestion.question === currentQuestion.question) {
        saveFlashcardData(handleDone);
      }
    }
    setHasTriggeredSave(false);
  }, [
    hasTriggeredSave,
    questions,
    saveFlashcardData,
    handleDone,
    currentQuestion
  ]);

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      setCurrentQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (answerTextRef.current) {
      const scrollHeight = answerTextRef.current.scrollHeight;
      setAnswerTextHeight(`${scrollHeight + 20}px`); // Add 20px to the content height
    }
  }, [currentQuestionIndex]);

  const handleQuestionSubmit = useCallback(() => {
    // setQuestions((prevQuestions) => {
    //   const updatedQuestions = [...prevQuestions];
    //   updatedQuestions[currentQuestionIndex] = currentQuestion;
    //   return updatedQuestions;
    // });
    if (questions.length > currentQuestionIndex + 1) {
      goToQuestion((prevIndex) => prevIndex + 1);
      setCurrentQuestion({
        questionType: 'openEnded',
        question: '',
        options: [],
        answer: ''
      });
    }
  }, [currentQuestionIndex, goToQuestion, questions]);

  // useEffect(() => {
  //   const { question, answer } = currentQuestion;
  //   const { question: storedQuestion, answer: storedAnswer } =
  //     questions[currentQuestionIndex];
  //   if (question !== storedQuestion || answer !== storedAnswer) {
  //     setQuestions((prevQuestions) => {
  //       const updatedQuestions = [...prevQuestions];
  //       updatedQuestions[currentQuestionIndex] = currentQuestion;
  //       return updatedQuestions;
  //     });
  //   }
  // }, [currentQuestion, questions, currentQuestionIndex, setQuestions]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('option')) {
      const optionIndex = Number(name.replace('option', ''));

      setCurrentQuestionData((prevQuestion) => {
        const newOptions = [...(prevQuestion.options || [])];
        newOptions[optionIndex] = value;
        return {
          ...prevQuestion,
          options: newOptions
        };
      });
    } else {
      setCurrentQuestionData((prevQuestion) => ({
        ...prevQuestion,
        [name]: value
      }));
    }
  };

  const handlePreviousQuestion = () => {
    goToQuestion((prevIndex: number) => prevIndex - 1);
  };

  return (
    <Box width={'100%'} mt="40px">
      <Box
        px={'12px'}
        py={'6px'}
        mb="40px"
        borderRadius="md"
        background={'#F4F5F6'}
        width={'fit-content'}
        display="flex"
        justifyContent={'center'}
        alignItems="center"
      >
        <Text fontSize="sm" lineHeight="normal" color="#6E7682">
          Question goes here {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <Text fontSize="sm" lineHeight="normal" color="#6E7682" ml="6px"></Text>
        <FiChevronRight color="#6E7682" />
      </Box>

      <FormControl mb={4}>
        <FormLabel>Enter your question:</FormLabel>
        <Textarea
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
          name="question"
          ref={questionTextareaRef}
          height={textareaHeight}
          maxHeight={'100px'}
          placeholder="Enter your question here"
          value={currentQuestion.question}
          onChange={handleChange}
        />
      </FormControl>
      <>
        {currentQuestion.questionType === 'multipleChoice' &&
          Array.from({ length: 4 }).map((_, index) => (
            <FormControl key={index} mb={4}>
              <FormLabel>{`Option ${String.fromCharCode(
                65 + index
              )}:`}</FormLabel>
              <Input
                type="text"
                name={`option${index}`}
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={currentQuestion.options?.[index] || ''}
                onChange={handleChange}
              />
            </FormControl>
          ))}
      </>
      <motion.div initial="hidden" animate="visible" exit="exit">
        {currentQuestion.questionType && (
          <FormControl mb={4}>
            <FormLabel>Answer:</FormLabel>
            {currentQuestion.questionType === 'multipleChoice' && (
              <Select
                name="answer"
                placeholder="Select answer"
                value={currentQuestion.answer}
                onChange={handleChange}
              >
                <option value="optionA">Option A</option>
                <option value="optionB">Option B</option>
                <option value="optionC">Option C</option>
                <option value="optionD">Option D</option>
              </Select>
            )}

            {currentQuestion.questionType === 'trueFalse' && (
              <Select
                name="answer"
                placeholder="Select answer"
                value={currentQuestion.answer}
                onChange={handleChange}
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </Select>
            )}
            {currentQuestion.questionType === 'openEnded' && (
              <Textarea
                _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
                name="answer"
                ref={answerTextRef}
                height={textareaAnswerHeight}
                placeholder="Select answer"
                value={currentQuestion.answer}
                onChange={handleChange}
              />
            )}
          </FormControl>
        )}
      </motion.div>
      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'space-between'} // updated to space-between to place buttons on opposite ends
        marginTop="40px"
        align={'flex-end'}
      >
        {showConfirm && (
          <Button
            borderRadius="8px"
            p="10px 20px"
            fontSize="14px"
            lineHeight="20px"
            variant="solid"
            colorScheme="primary"
            onClick={() => saveFlashcardData(handleDone)}
            ml={2}
          >
            Confirm
          </Button>
        )}
        <HStack
          w="100%"
          alignItems={'center'}
          justifyContent={'end'}
          marginTop="40px"
          align={'flex-end'}
        >
          {currentQuestionIndex > 0 && (
            <Button
              aria-label="Edit"
              height={'fit-content'}
              width={'fit-content'}
              variant="unstyled"
              fontWeight={500}
              p={0}
              color={'#207DF7'}
              _hover={{ bg: 'none', padding: '0px' }}
              _active={{ bg: 'none', padding: '0px' }}
              _focus={{ boxShadow: 'none' }}
              colorScheme="primary"
              onClick={handlePreviousQuestion}
              mr={2}
            >
              Previous
            </Button>
          )}
          (
          <Button
            borderRadius="8px"
            p="10px 20px"
            fontSize="14px"
            lineHeight="20px"
            variant="solid"
            colorScheme="primary"
            onClick={() => {
              currentQuestionIndex !== questions.length - 1
                ? handleQuestionSubmit()
                : handleSave();
            }}
            ml={5}
          >
            {currentQuestionIndex !== questions.length - 1
              ? ' Next Question'
              : 'Save'}
          </Button>
          )
        </HStack>
      </HStack>
    </Box>
  );
};

export default FlashCardQuestionsPage;
