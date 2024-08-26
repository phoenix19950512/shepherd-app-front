import TableTag from '../../../../components/CustomComponents/CustomTag';
import SelectComponent, { Option } from '../../../../components/Select';
import { languages } from '../../../../helpers';
import {
  MULTIPLE_CHOICE_SINGLE,
  OPEN_ENDED,
  QuizQuestion,
  QuizQuestionOption,
  TRUE_FALSE
} from '../../../../types';
// import useQuizState from '../context';
import {
  Box,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  HStack,
  Button,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import {
  forEach,
  isEmpty,
  isNil,
  keys,
  map,
  merge,
  omit,
  toLower,
  toString,
  values
} from 'lodash';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const ManualQuizForm = ({
  // addQuestion,
  openTags,
  tags,
  removeTag,
  isLoadingButton,
  title,
  handleSetTitle,
  uploadingState,
  handleCreateUpdateQuiz,
  preferredLang,
  setPreferredLang
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<
    Omit<QuizQuestion & { canEdit?: boolean }, 'options'> & {
      options?: Record<string, QuizQuestionOption> | QuizQuestionOption[];
    }
  >({
    type: MULTIPLE_CHOICE_SINGLE, //default question type option
    question: '',
    options: {},
    answer: '',
    canEdit: true
  });

  const [searchValue, setSearchValue] = useState('');

  const handleChangeQuestionType = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value
    }));
  };

  const handleQuestionAdd = async () => {
    let questionPayload: any = {
      ...currentQuestion,
      options: values(currentQuestion?.options)
    };

    if (currentQuestion.type === OPEN_ENDED) {
      questionPayload = omit(questionPayload, ['options']);
    }
    if (currentQuestion.type !== OPEN_ENDED) {
      questionPayload = omit(questionPayload, ['answer']);
    }

    await handleCreateUpdateQuiz([questionPayload], { canEdit: true });

    setTimeout(() => {
      setCurrentQuestion({
        type: MULTIPLE_CHOICE_SINGLE,
        question: '',
        options: {},
        answer: ''
      });
    });
  };

  const handleChangeOption = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setCurrentQuestion((prevQuestion: any) => {
      if (prevQuestion.options) {
        const newOptions = { ...prevQuestion.options };
        newOptions[name] = { content: value, isCorrect: false };
        return {
          ...prevQuestion,
          options: newOptions
        };
      }
    });
  };

  const handleSetOptionAnswer = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentQuestion((prevQuestion: any) => {
      let newOptions = {};
      const optionKeys = keys(prevQuestion.options);

      newOptions = { ...prevQuestion.options };
      if (prevQuestion.type === TRUE_FALSE) {
        newOptions = {
          true: {
            content: 'True',
            isCorrect: false
          },
          false: {
            content: 'False',
            isCorrect: false
          }
        };
      }
      if (prevQuestion.type === MULTIPLE_CHOICE_SINGLE) {
        forEach(optionKeys, (key) => {
          newOptions[key] = {
            ...newOptions[key],
            isCorrect: false
          };
        });
      }

      const prev = newOptions[value];
      newOptions[value] = { ...prev, isCorrect: true };

      return {
        ...prevQuestion,
        options: newOptions,
        [name]: toString(value)
      };
    });
  };

  const typeOptions = [
    { label: 'Multiple Single Choice', value: MULTIPLE_CHOICE_SINGLE },
    { label: 'True/False', value: TRUE_FALSE },
    { label: 'Open Ended', value: OPEN_ENDED }
  ];

  const trueFalseOptions = [
    { label: 'True', value: true },
    { label: 'False', value: false }
  ];

  const multipleChoiceSingleOptions = [
    { label: 'Option A', value: 'optionA' },
    { label: 'Option B', value: 'optionB' },
    { label: 'Option C', value: 'optionC' },
    { label: 'Option D', value: 'optionD' }
  ];

  return (
    <Box width={'100%'} mt="2rem">
      {!isEmpty(tags) && (
        <HStack
          flexWrap={'wrap'}
          justifyContent={'flex-start'}
          alignItems={'center'}
          mb={4}
        >
          {tags.map((tag, idx) => (
            <TableTag
              key={tag}
              label={tag}
              onClick={() => removeTag(idx)}
              showClose
            />
          ))}
        </HStack>
      )}
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Preferred Language
          </span>
        </FormLabel>
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
            {preferredLang || 'Select a language...'}
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
                      setPreferredLang(lang as typeof preferredLang)
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
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Enter a title
          </span>
        </FormLabel>
        <Input
          value={title}
          type="text"
          onChange={(e) => handleSetTitle(e.target.value)}
          autoComplete="off"
          height={'3rem'}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Select question type:
          </span>
        </FormLabel>

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
            {typeOptions.find((type) => type.value === currentQuestion.type)
              ?.label || 'Select Type'}
          </MenuButton>
          <MenuList zIndex={3}>
            {typeOptions.map((type) => (
              <MenuItem
                fontSize="0.875rem"
                key={type.value}
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => {
                  handleChangeQuestionType({
                    target: {
                      name: 'type',
                      value: type.value
                    }
                  } as ChangeEvent<HTMLSelectElement>);
                }}
              >
                {type.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel textColor={'text.600'}>
          <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
            Enter your question:
          </span>
        </FormLabel>
        <Textarea
          name="question"
          placeholder="Enter your question here"
          value={currentQuestion.question}
          onChange={handleChangeQuestionType}
          _placeholder={{
            color: '#9A9DA2',
            fontSize: '14px'
          }}
          textColor={'#9A9DA2'}
          fontSize={'0.87rem'}
          fontWeight={400}
        />
      </FormControl>
      <>
        {!isEmpty(currentQuestion.question) &&
          currentQuestion.type === MULTIPLE_CHOICE_SINGLE &&
          Array.from({ length: 4 }).map((_, index) => (
            <FormControl key={index} mb={4}>
              <FormLabel>
                <span className="text-[0.87rem] leading-[1.06rem] text-[#5C5F64]">
                  {`Option ${String.fromCharCode(65 + index)}:`}
                </span>
              </FormLabel>
              <Input
                type="text"
                name={`option${String.fromCharCode(65 + index)}`}
                placeholder={`Option ${String.fromCharCode(65 + index)}`}
                value={
                  currentQuestion.options &&
                  currentQuestion.options[
                    `option${String.fromCharCode(65 + index)}`
                  ]?.content
                }
                onChange={handleChangeOption}
                height={'3rem'}
                _placeholder={{
                  color: '#9A9DA2',
                  fontSize: '14px'
                }}
                fontSize={'0.87rem'}
                fontWeight={400}
              />
            </FormControl>
          ))}
      </>
      {!isEmpty(currentQuestion.question) && currentQuestion.type && (
        <FormControl mb={4}>
          <FormLabel textColor={'text.600'}>Answer:</FormLabel>
          {/* {currentQuestion.type === MULTIPLE_CHOICE_SINGLE && (
            <SelectComponent
              name="answer"
              placeholder="Select answer"
              options={multipleChoiceSingleOptions}
              size={'md'}
              onChange={(option) => {
                const event = {
                  target: {
                    name: 'answer',
                    value: (option as Option).value
                  }
                } as ChangeEvent<HTMLSelectElement>;
                handleSetOptionAnswer(event);
              }}
            />
          )} */}
          {currentQuestion.type === MULTIPLE_CHOICE_SINGLE && (
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
                {multipleChoiceSingleOptions.find(
                  (type) => type.value === currentQuestion.answer
                )?.label || 'Select answer'}
              </MenuButton>
              <MenuList zIndex={3}>
                {multipleChoiceSingleOptions.map((type) => (
                  <MenuItem
                    fontSize="0.875rem"
                    key={type.value}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      const event = {
                        target: {
                          name: 'answer',
                          value: type.value
                        }
                      } as ChangeEvent<HTMLSelectElement>;
                      handleSetOptionAnswer(event);
                    }}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
          {currentQuestion.type === TRUE_FALSE && (
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
                {values(currentQuestion.options).find(
                  (option) => option.isCorrect
                )?.content || 'Select answer'}
              </MenuButton>
              <MenuList zIndex={3}>
                {trueFalseOptions.map((type) => (
                  <MenuItem
                    fontSize="0.875rem"
                    key={type.label}
                    _hover={{ bgColor: '#F2F4F7' }}
                    onClick={() => {
                      const event = {
                        target: {
                          name: 'answer',
                          value: type.value
                        }
                      } as ChangeEvent<any>;
                      handleSetOptionAnswer(event);
                    }}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
          {currentQuestion.type === OPEN_ENDED && (
            <Textarea
              name="answer"
              placeholder="Select answer"
              value={currentQuestion.answer}
              onChange={handleSetOptionAnswer}
              _placeholder={{
                color: '#9A9DA2',
                fontSize: '14px'
              }}
              textColor={'#9A9DA2'}
              fontSize={'0.87rem'}
              fontWeight={400}
            />
          )}
        </FormControl>
      )}

      <HStack
        w="100%"
        alignItems={'center'}
        justifyContent={'end'}
        marginTop="40px"
        align={'flex-end'}
        marginBottom={4}
      >
        <Button
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={openTags}
          ml={5}
          isDisabled={isEmpty(title) || tags?.length >= 10}
          isLoading={isLoadingButton}
        >
          Add Tags
        </Button>
        (
        <Button
          borderRadius="8px"
          p="10px 20px"
          fontSize="14px"
          lineHeight="20px"
          variant="solid"
          colorScheme="primary"
          onClick={handleQuestionAdd}
          ml={5}
          isDisabled={
            uploadingState || isEmpty(currentQuestion.answer) || isEmpty(title)
          }
          isLoading={isLoadingButton}
        >
          Add Question
        </Button>
        )
      </HStack>
    </Box>
  );
};

export default ManualQuizForm;
