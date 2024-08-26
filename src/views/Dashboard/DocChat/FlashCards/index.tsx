import QuestionMark from '../../../../assets/questionMark.svg?react';
// import flashcardStore from '../../../state/flashcardStore';
import { useFlashcardWizard } from '../../FlashCards/context/flashcard';
import { RadioInput, StyledCheckbox } from '../styles';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useMemo, useState, useCallback, ChangeEvent } from 'react';

const FlashcardFirstPart = ({ isAutomated }: { isAutomated?: boolean }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { flashcardData, setFlashcardData, goToNextStep } =
    useFlashcardWizard();
  // const { createFlashCard, flashcard, isLoading, fetchFlashcards } =
  //   flashcardStore();
  const [localData, setLocalData] = useState<typeof flashcardData>({
    subject: '',
    topic: '',
    studyType: '',
    deckname: '',
    studyPeriod: '',
    numQuestions: 0,
    studyDuration: 'Quick practice',
    timerDuration: '',
    hasSubmitted: false,
    selectPagesInclude: undefined
  });

  useEffect(() => {
    if (flashcardData?.deckname) {
      setLocalData(flashcardData);
    }
  }, [flashcardData]);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value, type } = e.target;

      if (type === 'checkbox') {
        const checkbox = e.target as HTMLInputElement;
        setLocalData((prevState) => ({
          ...prevState,
          [name]: checkbox.checked
            ? [...(prevState[name] || []), value]
            : prevState[name].filter((val: string) => val !== value)
        }));
      } else if (name === 'selectPagesInclude') {
        if (Number(value) <= 5) {
          setLocalData((prevState) => ({
            ...prevState,
            [name]: Number(value)
          }));
        } else {
          throw new Error('Upgrade to Pro plan to use this feature');
        }
      } else {
        setLocalData((prevState) => ({ ...prevState, [name]: value }));
      }
    },
    [setLocalData]
  );

  const isValid = useMemo(() => {
    const { hasSubmitted, studyDuration, subject, topic, ...data } = localData;
    let payload: { [key: string]: any } = { ...data };
    if (isAutomated) {
      payload = { ...payload, subject };
    }

    return Object.values(payload).every(Boolean);
  }, [localData, isAutomated]);

  const handleSubmit = () => {
    setIsGenerating(true);
    setFlashcardData((prevState) => ({
      ...prevState,
      ...localData,
      hasSubmitted: true
    }));
    if (!isAutomated) goToNextStep();
    setIsGenerating(false);
  };

  const selectQuestionTypes = [
    {
      id: 1,
      value: 'Open-ended'
    },
    {
      id: 2,
      value: 'True/false'
    },
    {
      id: 3,
      value: 'Fill the blank'
    },
    {
      id: 4,
      value: 'Multiple choice'
    },
    {
      id: 5,
      value: 'Multiple select'
    }
  ];

  const studyDuration = [
    {
      id: 1,
      value: 'longTermRetention',
      label: 'Long term retention'
    },
    {
      id: 2,
      value: 'quickPractice',
      label: 'Quick practice'
    }
  ];

  return (
    <Box bg="white" width="100%" mt="30px" padding="0 10px">
      <FormControl mb={6}>
        <FormLabel fontSize="0.75rem" lineHeight="17px" color="#5C5F64" mb={3}>
          Subject
        </FormLabel>
        <Input
          type="text"
          name="subject"
          placeholder="e.g. biology"
          value={localData.subject}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
        />
      </FormControl>
      <FormControl mb={6}>
        <FormLabel fontSize="0.75rem" lineHeight="17px" color="#5C5F64" mb={3}>
          Topic
        </FormLabel>
        <Input
          type="text"
          name="topic"
          placeholder="e.g genetics"
          value={localData.topic}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
        />
      </FormControl>
      <FormControl mb={6}>
        <FormLabel fontSize="0.75rem" lineHeight="17px" color="#5C5F64" mb={3}>
          Deckname
        </FormLabel>
        <Input
          type="text"
          name="deckname"
          placeholder="e.g. Deckname"
          value={localData.deckname}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.8756rem', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={6}>
        <FormLabel fontSize="0.75rem">Select question type</FormLabel>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {studyDuration.map((duration) => (
            <FormLabel
              key={duration.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#212224'
              }}
            >
              <RadioInput
                name="studyDuration"
                type="radio"
                checked={
                  localData.studyDuration?.trim() === duration.value.trim()
                }
                onChange={handleChange}
                value={duration.value}
                tabIndex={-1}
              />
              {duration.label}
            </FormLabel>
          ))}
        </div>
      </FormControl>

      {/* <FormControl mb={6}>
        <FormLabel fontSize="0.75rem">Select question type</FormLabel>
        <div
          style={{
            display: 'flex',
            gap: '13px',
            flexWrap: 'wrap'
          }}
        >
          {selectQuestionTypes?.map((selectQuestionType) => (
            <div key={selectQuestionType.id}>
              <FormLabel fontSize="0.875rem">
                <StyledCheckbox
                  type="checkbox"
                  name="selectQuestionTypes"
                  onChange={handleChange}
                  value={selectQuestionType.value}
                />
                {selectQuestionType.value}
              </FormLabel>
            </div>
          ))}
        </div>
      </FormControl> */}

      {/* <FormControl mb={6}>
        <FormLabel fontSize="0.75rem" lineHeight="17px" color="#5C5F64" mb={3}>
          How often would you like to study?
        </FormLabel>
        <Select
          name="studyPeriod"
          placeholder="Select study period"
          value={localData.studyPeriod}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Once a week</option>
          <option value="biweekly">Twice a week</option>
          <option value="spacedRepetition">Spaced repetition</option>
        </Select>
      </FormControl> */}

      <FormControl mb={6}>
        <FormLabel
          fontSize="0.75rem"
          lineHeight="17px"
          color="#5C5F64"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
          mb={3}
        >
          Number of questions
          <Popover>
            <PopoverTrigger>
              <QuestionMark />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                Shepherd will create as many flashcard as it can but not more
                than the limit entered
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </FormLabel>
        <Input
          type="number"
          min={1}
          name="numQuestions"
          placeholder="Number of questions"
          value={localData.numQuestions}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.875rem', color: '#9A9DA2' }}
        />
      </FormControl>

      {/* <FormControl mb={6}>
        <FormLabel
          fontSize="12px"
          lineHeight="17px"
          color="#5C5F64"
          mb={3}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          Select pages to include
          <Popover placement="top-start">
            <PopoverTrigger>
              <QuestionMark />
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>
                Your plan limits you to only 5 pages for your document.{' '}
                <a
                  href={window.location.hostname}
                  style={{
                    color: '#0B8CE9',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Upgrade to a pro plan
                </a>{' '}
                for full access
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </FormLabel>
        <Input
          type="text"
          min={1}
          name="selectPagesInclude"
          placeholder="e.g 1-4"
          value={localData.selectPagesInclude}
          onChange={handleChange}
          _placeholder={{ fontSize: '0.8756rem', color: '#9A9DA2' }}
        />
      </FormControl> */}

      {/* <FormControl mb={6}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          Timer settings (Optional)
        </FormLabel>
        <Select
          name="timerDuration"
          placeholder="Select a duration"
          value={localData.timerDuration}
          onChange={handleChange}
          _placeholder={{
            fontSize: '14px',
            color: '#9A9DA2',
            paddingTop: '0px'
          }}
        >
          <option value="30">30 sec</option>
          <option value="15">15 sec</option>
        </Select>
      </FormControl> */}
      <HStack w="full" align={'flex-end'}>
        <Button
          variant="solid"
          isDisabled={flashcardData.hasSubmitted || !isValid || isGenerating}
          colorScheme="primary"
          size="sm"
          ml="auto"
          fontSize={'14px'}
          mt={4}
          padding="20px 25px"
          onClick={() => handleSubmit()}
        >
          {isGenerating ? (
            <Spinner size="sm" mr={2} />
          ) : (
            <svg
              style={{ marginRight: '4px' }}
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
          )}
          Generate Flashcard
        </Button>
      </HStack>
    </Box>
  );
};

export default FlashcardFirstPart;
