import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import PlansModal from '../../../../components/PlansModal';
import SelectComponent, { Option } from '../../../../components/Select';
import { WardIcon } from '../../../../components/icons';
import { languages } from '../../../../helpers';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import {
  MIXED,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  TRUE_FALSE
} from '../../../../types';
import { QuestionIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Textarea,
  Tooltip,
  Select
} from '@chakra-ui/react';
import { isEmpty, includes, isNil, map, toNumber } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';

// DownloadIcon

const TextQuizForm = ({ addQuestion, handleSetTitle }) => {
  const toast = useCustomToast();
  const [preferredLanguage, setPreferredLanguage] = useState<
    (typeof languages)[number]
  >(languages[0]);
  const { user, hasActiveSubscription, quizCountLimit } = userStore();
  const [isLoading, setIsLoading] = useState(false);
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: 'mixed'
  };

  const levelOptions = [
    { label: 'Very Easy', value: 'kindergarten' },
    { label: 'Medium', value: 'high school' },
    { label: 'Hard', value: 'college' },
    { label: 'Very Hard', value: 'PhD' }
  ];

  const typeOptions = [
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED },
    { label: 'Mixed', value: MIXED }
  ];

  const [localData, setLocalData] = useState<any>(dummyData);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true);
      const quizCountResponse = await ApiService.checkQuizCount(user._id);
      const userQuizCount = await quizCountResponse.json();

      if (
        (!hasActiveSubscription && userQuizCount.count >= 40) ||
        userQuizCount.count >= quizCountLimit
      ) {
        setPlansModalMessage(
          !hasActiveSubscription
            ? "Let's get you on a plan so you can generate quizzes! "
            : "Looks like you've filled up your quiz store! 🚀"
        );
        setPlansModalSubMessage(
          !hasActiveSubscription
            ? 'Get started today for free!'
            : "Let's upgrade your plan so you can keep generating more."
        );
        setTogglePlansModal(true); // Show the PlansModal
        return;
      }
      const result = await ApiService.generateQuizQuestion(
        user._id,
        {
          ...localData,
          count: toNumber(localData.count),
          firebaseId: user.firebaseId
        },
        preferredLanguage
      );
      const { quizzes } = await result.json();

      addQuestion(
        map([...quizzes], (quiz) => {
          let type = quiz?.type;

          if (isNil(type) || isEmpty(type)) {
            if (!isNil(quiz?.options) || !isEmpty(quiz?.options)) {
              if (quiz?.options?.length < 3) {
                type = TRUE_FALSE;
              } else {
                type = MULTIPLE_CHOICE_SINGLE;
              }
            } else {
              if (!isEmpty(quiz?.answer) || !isNil(quiz?.answer)) {
                type = OPEN_ENDED;
              }
            }
          } else {
            if (includes(MULTIPLE_CHOICE_SINGLE, type)) {
              type = MULTIPLE_CHOICE_SINGLE;
            }
            if (includes(TRUE_FALSE, type)) {
              type = TRUE_FALSE;
            }
            if (includes(OPEN_ENDED, type)) {
              type = OPEN_ENDED;
            }
          }

          handleSetTitle(localData?.topic);

          return {
            ...quiz,
            type
          };
        }),
        'multiple'
      );

      setLocalData(dummyData);
      toast({
        position: 'top-right',
        title: `quizzes generated`,
        status: 'success'
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes `,
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setLocalData((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  return (
    <Box width={'100%'} mt="20px">
      <FormControl mb={4}>
        <FormLabel fontSize="12px" lineHeight="17px" color={'text.500'} mb={3}>
          Preferred Language
        </FormLabel>
        <Select
          isRequired
          id="language_select"
          name="language_select"
          className="pt-1"
          value={preferredLanguage}
          onChange={(e) => {
            setPreferredLanguage(e.target.value as typeof preferredLanguage);
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Enter a text</FormLabel>
        <Textarea
          h={'200px'}
          _placeholder={{
            color: 'text.700',
            fontSize: '14px'
          }}
          placeholder="Generate questions from your notes. 
          Type or copy and paste from your notes. 
          Maximum 200 characters. Premium subscribers get up to 5000 characters"
          size="lg"
          value={localData.subject}
          name="subject"
          onChange={handleChange}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>Question type:</FormLabel>

        <SelectComponent
          name="type"
          defaultValue={typeOptions.find(
            (option) => option.value === localData.type
          )}
          placeholder="Select Type"
          options={typeOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'type',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel color={'text.500'}>Topic: </FormLabel>
        <Input
          type="text"
          name="topic"
          placeholder="e.g. Chemistry"
          value={localData.topic}
          onChange={handleChange}
          _placeholder={{ fontSize: '14px', color: '#9A9DA2' }}
        />
      </FormControl>

      <FormControl mb={8}>
        <FormLabel color={'text.500'}>Level (optional): </FormLabel>
        <SelectComponent
          name="level"
          placeholder="Select Level"
          defaultValue={levelOptions.find(
            (option) => option.value === localData.difficulty
          )}
          options={levelOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'difficulty',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel color={'text.500'}>
          Number of questions
          <Tooltip
            hasArrow
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input
          textColor={'text.700'}
          height={'48px'}
          name="count"
          onChange={handleChange}
          type="number"
          value={localData.count}
        />
      </FormControl>

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
      >
        <Button
          width={'180px'}
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleGenerateQuestions}
          ml={5}
          isDisabled={
            localData.count < 1 ||
            isEmpty(localData.topic) ||
            isEmpty(localData.subject)
          }
          isLoading={isLoading}
        >
          <WardIcon className={'h-[20px] w-[20px] mx-2'} onClick={() => ''} />
          Generate
        </Button>
      </HStack>
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage}
          subMessage={plansModalSubMessage}
        />
      )}
    </Box>
  );
};

export default TextQuizForm;
