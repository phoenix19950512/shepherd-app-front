import { useCustomToast } from '../../../../components/CustomComponents/CustomToast/useCustomToast';
import SelectComponent, { Option } from '../../../../components/Select';
import PlansModal from '../../../../components/PlansModal';
import { WardIcon } from '../../../../components/icons';
import ApiService from '../../../../services/ApiService';
import userStore from '../../../../state/userStore';
import {
  MIXED,
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  TRUE_FALSE
} from '../../../../types';
import { QuestionIcon, InfoIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  Input,
  HStack,
  Button,
  FormLabel,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
  Flex,
  Icon,
  Text,
  CloseButton
} from '@chakra-ui/react';
import { isEmpty, toNumber } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { languages } from '../../../../helpers';
import { FiChevronDown } from 'react-icons/fi';

const TopicQuizForm = ({
  handleSetTitle,
  title,
  handleFormatQuizQuestionCallback,
  handleSetUploadingState,
  uploadingState
}) => {
  const toast = useCustomToast();
  const { hasActiveSubscription, user, quizCountLimit } = userStore();
  const dummyData = {
    subject: '',
    topic: '',
    difficulty: 'kindergarten',
    count: 1,
    type: MIXED,
    grade: ''
  };

  // const { handleIsLoadingQuizzes, fetchQuizzes } = quizStore();

  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState<any>(dummyData);

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

  const gradeOptions = [
    { label: 'High school freshman', value: 'High school freshman' },
    { label: 'High school sophomore', value: 'High school sophomore' },
    { label: 'High school junior', value: 'High school junior' },
    { label: 'High school senior', value: 'High school senior' },
    { label: 'College freshman', value: 'College freshman' },
    { label: 'College sophomore', value: 'College sophomore' },
    { label: 'College junior', value: 'College junior' },
    { label: 'College senior', value: 'College senior' }
  ];

  const [preferredLanguage, setPreferredLanguage] = useState<
    (typeof languages)[number]
  >(languages[0]);
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateQuestions = async () => {
    try {
      handleSetUploadingState(true);
      setIsLoading(true);
      setIsGenerating(true);

      const quizCountResponse = await ApiService.checkQuizCount(user._id);
      const userQuizCount = await quizCountResponse.json();

      const quizzesRemaining = quizCountLimit - userQuizCount.count;

      if (quizzesRemaining <= 0) {
        // User has reached or exceeded their limit
        setPlansModalMessage(
          !hasActiveSubscription
            ? "Let's get you on a plan so you can generate more questions! "
            : "Looks like you've filled up your quiz store! 🚀"
        );
        setPlansModalSubMessage(
          !hasActiveSubscription
            ? 'Get started today for free!'
            : "Let's upgrade your plan so you can keep generating more."
        );
        setIsLoading(false);
        setIsGenerating(false);
        setTogglePlansModal(true); // Show the PlansModal
        localData.count = 0;
        setTogglePlansModal(true);
        return;
      } else if (localData.count > quizzesRemaining) {
        handleSetUploadingState(true);
        // User has requested more quizzes than they are allowed to generate
        const requestedAmount = localData.count;
        toast({
          render: ({ onClose }) => (
            <Box
              color="white"
              p={4}
              bg="blue.500"
              borderRadius="md"
              position="relative"
            >
              <Flex align="start">
                <Icon as={InfoIcon} color="white" w={5} h={5} mt="1" mr={3} />
                <Box flex="1">
                  <Text fontSize="md" mr={6} ml={8}>
                    You've requested {requestedAmount} question
                    {requestedAmount > 1 ? 's' : ''}, but can only generate{' '}
                    {quizzesRemaining} more under your current plan.
                  </Text>
                  <Text fontSize="sm" mt={4} mr={6} ml={6}>
                    Consider upgrading your plan for more question generations.
                  </Text>
                </Box>
              </Flex>
              <CloseButton
                position="absolute"
                top="1"
                right="1"
                onClick={onClose}
                color="white"
              />
            </Box>
          ),
          isClosable: true
        });
        // Adjust the requested quiz count to the maximum allowed
        setLocalData((prevState) => ({
          ...prevState,
          count: quizzesRemaining
        }));

        localData.count = quizzesRemaining;
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

      await handleFormatQuizQuestionCallback(quizzes, localData.count, () => {
        setIsLoading(false);
        handleSetUploadingState(false);
      });
    } catch (error) {
      toast({
        position: 'top-right',
        title: `failed to generate quizzes job `,
        status: 'error'
      });
    } finally {
      handleSetUploadingState(false);
      setIsGenerating(false);
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
    <Box width={'100%'} mt="2rem">
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>Preferred Language</FormLabel>
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            borderRadius="8px"
            width="100%"
            fontFamily="Inter"
            textAlign="left"
            fontWeight="400"
            fontSize="0.875rem"
            height="3rem"
            textColor={'#9A9DA2'}
          >
            {preferredLanguage || 'Select a language...'}
          </MenuButton>
          <MenuList zIndex={3}>
            <Input
              size="sm"
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search Language"
              value={searchValue}
              height={'3rem'}
              _placeholder={{
                color: '#9A9DA2',
                fontSize: '14px'
              }}
              fontSize={'0.87rem'}
              fontWeight={400}
            />
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '10px'
              }}
            >
              {languages
                .filter((lang) =>
                  lang.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((lang) => (
                  <MenuItem
                    fontSize="0.875rem"
                    key={lang}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() =>
                      setPreferredLanguage(lang as typeof preferredLanguage)
                    }
                  >
                    {lang}
                  </MenuItem>
                ))}
            </div>
          </MenuList>
        </Menu>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>Enter a title</FormLabel>
        <Input
          value={title}
          type="text"
          onChange={(e) => handleSetTitle(e.target.value)}
          autoComplete="off"
          defaultValue={title}
          height={'3rem'}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>
      <FormControl mb={8}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Subject:
          </span>
        </FormLabel>
        <Input
          type="text"
          name="subject"
          placeholder="e.g. Chemistry"
          value={localData.subject}
          onChange={handleChange}
          height={'3rem'}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>
      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Enter a topic
          </span>
        </FormLabel>
        <Input
          type="text"
          name="topic"
          value={localData?.topic}
          onChange={handleChange}
          height={'3rem'}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Question type:
          </span>
        </FormLabel>

        {/* <SelectComponent
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
        /> */}
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            borderRadius="8px"
            width="100%"
            fontFamily="Inter"
            textAlign="left"
            fontWeight="400"
            fontSize="0.875rem"
            height="3rem"
            textColor={'#9A9DA2'}
          >
            {typeOptions.find((option) => option.value === localData.type)
              ?.label || 'Select Type'}
          </MenuButton>
          <MenuList zIndex={3}>
            {typeOptions.map((type) => (
              <MenuItem
                fontSize="0.875rem"
                key={type.value}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => {
                  const event = {
                    target: {
                      name: 'type',
                      value: type.value
                    }
                  } as ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl mb={8}>
        <FormLabel fontSize="12px" lineHeight="17px" color="#5C5F64" mb={3}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Grade (optional):
          </span>
        </FormLabel>
        {/* <SelectComponent
          name="grade"
          placeholder="Select grade"
          defaultValue={gradeOptions.find(
            (option) => option.value === localData?.grade
          )}
          tagVariant="solid"
          options={gradeOptions}
          size={'md'}
          onChange={(option) => {
            const event = {
              target: {
                name: 'grade',
                value: (option as Option).value
              }
            } as ChangeEvent<HTMLSelectElement>;
            handleChange(event);
          }}
        /> */}
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            borderRadius="8px"
            width="100%"
            fontFamily="Inter"
            textAlign="left"
            fontWeight="400"
            fontSize="0.875rem"
            height="3rem"
            textColor={'#9A9DA2'}
          >
            {gradeOptions.find((option) => option.value === localData.grade)
              ?.label || 'Select Grade'}
          </MenuButton>
          <MenuList zIndex={3}>
            {gradeOptions.map((type) => (
              <MenuItem
                fontSize="0.875rem"
                key={type.value}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => {
                  const event = {
                    target: {
                      name: 'grade',
                      value: type.value
                    }
                  } as ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl mb={8}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Level (optional):
          </span>
        </FormLabel>
        {/* <SelectComponent
          name="difficulty"
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
        /> */}
        <Menu>
          <MenuButton
            as={Button}
            variant="outline"
            rightIcon={<FiChevronDown />}
            borderRadius="8px"
            width="100%"
            fontFamily="Inter"
            textAlign="left"
            fontWeight="400"
            fontSize="0.875rem"
            height="3rem"
            textColor={'#9A9DA2'}
          >
            {levelOptions.find(
              (option) => option.value === localData.difficulty
            )?.label || 'Select Level'}
          </MenuButton>
          <MenuList zIndex={3}>
            {levelOptions.map((type) => (
              <MenuItem
                fontSize="0.875rem"
                key={type.value}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => {
                  const event = {
                    target: {
                      name: 'difficulty',
                      value: type.value
                    }
                  } as ChangeEvent<HTMLSelectElement>;
                  handleChange(event);
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl mb={7}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Number of questions
          </span>
          <Tooltip
            hasArrow
            label="Number of questions to create"
            placement="right-end"
          >
            <QuestionIcon mx={2} w={3} h={3} />
          </Tooltip>
        </FormLabel>
        <Input
          name="count"
          onChange={handleChange}
          type="text"
          value={localData.count}
          height={'3rem'}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
        marginBottom={4}
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
          isDisabled={
            isGenerating ||
            uploadingState ||
            localData.count < 1 ||
            isEmpty(localData.topic) ||
            isEmpty(localData.subject)
          }
          isLoading={isLoading || isGenerating}
          ml={5}
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

export default TopicQuizForm;
