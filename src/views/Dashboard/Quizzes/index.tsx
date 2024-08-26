import { useCustomToast } from '../../../components/CustomComponents/CustomToast/useCustomToast';
import TagModal from '../../../components/TagModal';
// import TagModal from '../../../components/TagModal';
import { DeleteModal } from '../../../components/deleteModal';
import LoaderOverlay from '../../../components/loaderOverlay';
import SelectableTable, { TableColumn } from '../../../components/table';
import { useSearch } from '../../../hooks';
import quizStore from '../../../state/quizStore';
import {
  QuizData,
  QuizQuestion,
  Score,
  MinimizedStudy,
  SchedulePayload
} from '../../../types';
import './styles.css';
import {
  Text,
  Box,
  Button,
  Flex,
  Image,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Stack
} from '@chakra-ui/react';
import {
  parseISO,
  format,
  isSameDay,
  isThisWeek,
  getISOWeek,
  parse
} from 'date-fns';
import { isEmpty, isNaN, truncate } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaCalendarAlt, FaEllipsisH } from 'react-icons/fa';
import { IoCreateOutline } from 'react-icons/io5';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import ScheduleStudyModal, {
  ScheduleFormState
} from './components/scheduleModal';
import { RiShareForwardLine } from '@remixicon/react';
import ShareModalMenu from '../../../components/ShareModalMenu';
import moment from 'moment';
import MobileList from './mobileTable';
import useIsMobile from '../../../helpers/useIsMobile';

const StyledImage = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 50%;
  height: 26px;
  width: 26px;
  border: 0.6px solid #eaeaeb;
  box-shadow: 0 2px 10px rgba(63, 81, 94, 0.1);
`;

interface Option {
  label: string;
  value: string;
}

type DataSourceItem = {
  key: string;
  title: string;
  studyType?: string;
  studyPeriod?: string;
  createdAt: string;
  scores: Score[];
  questions: QuizQuestion[];
  currentStudy?: MinimizedStudy;
  tags: string[];
};

const Quizzes = () => {
  const toast = useCustomToast();
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Array<string | number>>([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState<Array<string>>([]);
  const [multiSelected, setMultiSelected] = useState<any>([]);
  const [tagEditItem, setTagEditItem] = useState<{
    quiz?: QuizData;
    quizIds?: string[];
  } | null>(null);
  const isMobile = useIsMobile();

  const {
    handleToggleStartQuizModal,
    fetchQuizzes,
    quizzes,
    pagination,
    loadQuiz,
    deleteQuiz,
    tags,
    isLoading,
    storeQuizTags,
    scheduleQuiz
  } = quizStore();

  const [scheduleItem, setScheduleItem] = useState<{
    quiz: QuizData;
  } | null>(null);

  const handleSelectionChange = (selectedOptions: Option[]) => {
    setMultiSelected(selectedOptions);

    const selectedTags = selectedOptions
      .map((option) => option.value)
      .join(',');

    const query: { [key: string]: any } = {};
    if (selectedTags) {
      query.tags = selectedTags;
    }

    fetchQuizzes(query);
  };

  function findNextQuiz(quizzes: QuizData[]): QuizData | undefined {
    // Order of preference for studyPeriods
    const studyPeriodPreference = [
      'daily',
      'weekly',
      'biweekly',
      'spacedRepetition'
    ];

    // Sort flashcards based on studyPeriodPreference
    const sortedFlashcards = quizzes.sort((a, b) => {
      return (
        studyPeriodPreference.indexOf(a?.studyPeriod as string) -
        studyPeriodPreference.indexOf(b?.studyPeriod as string)
      );
    });

    // Get today's date
    const today = new Date();

    // Go through sorted flashcards to find the one that should be loaded
    for (const card of sortedFlashcards) {
      // Get date of last attempt
      const lastAttemptDate =
        card.scores.length > 0
          ? new Date(card.scores[card.scores.length - 1].date)
          : undefined;

      // Check if the flashcard should be attempted today based on its studyPeriod
      switch (card.studyPeriod) {
        case 'daily':
          if (!lastAttemptDate || !isSameDay(lastAttemptDate, today)) {
            return card;
          }
          break;
        case 'weekly':
          if (!lastAttemptDate || !isThisWeek(lastAttemptDate)) {
            return card;
          }
          break;
        case 'biweekly':
          if (
            !lastAttemptDate ||
            !isThisWeek(lastAttemptDate) ||
            getISOWeek(today) % 2 === 0
          ) {
            return card;
          }
          break;
        case 'spacedRepetition':
          // In case of spaced repetition, load the card only if it's due
          // Here we need more information on how the spaced repetition should work
          break;
        default:
          break;
      }
    }

    // If no card is found, return undefined
    return undefined;
  }

  const options: Option[] = tags.map((tag) => ({
    label: tag,
    value: tag
  }));

  const searchQuizzes = useCallback(
    (query: string) => {
      if (!hasSearched) setHasSearched(true);
      fetchQuizzes({ search: query });
    },
    [fetchQuizzes, hasSearched]
  );

  const handleSearch = useSearch(searchQuizzes);

  const [deleteItem, setDeleteItem] = useState<{
    quiz?: QuizData;
    quizIds?: string[];
    currentDeleteType?: 'multiple' | 'single';
  } | null>(null);

  useEffect(() => {
    fetchQuizzes();
    // eslint-disable-next-line
  }, []);

  const handleEventSchedule = async (data: ScheduleFormState) => {
    const parsedTime = parse(data.time.toLowerCase(), 'hh:mm aa', new Date());
    const time = format(parsedTime, 'HH:mm');
    const day = moment(data.day).format('YYYY-MM-DD');
    const payload: SchedulePayload = {
      entityId: scheduleItem?.quiz._id as string,
      entityType: 'quiz',
      startDates: [moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')],
      startTime: time
    };

    if (data.frequency && data.frequency !== 'none') {
      payload.recurrence = { frequency: data.frequency };
      if (data.endDate) {
        payload.recurrence.endDate = data.endDate.toISOString();
      }
    }
    const isSuccess = await scheduleQuiz(payload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.quiz.title} Scheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
    } else {
      toast({
        position: 'top-right',
        title: `Failed to schedule ${scheduleItem?.quiz.title} flashcards`,
        status: 'error'
      });
    }
  };

  const columns: TableColumn<DataSourceItem>[] = [
    {
      title: 'Quiz Name',
      dataIndex: 'title',
      key: 'title',
      render: ({ title, key }) => (
        <Text
          color="#207DF7"
          onClick={() => {
            loadQuiz(key);
            handleToggleStartQuizModal(true);
          }}
          fontWeight="500"
          title={title}
        >
          {truncate(title, { length: 50 })}
        </Text>
      )
    },

    {
      title: 'No of Questions',
      dataIndex: 'questions',
      key: 'questions',
      render: ({ questions }) => {
        return <Text fontWeight="500">{questions.length}</Text>;
      }
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      width: '350px',
      height: '50px',
      scrollY: true,
      render: ({ tags }) => {
        if (!tags?.length) return <Text fontWeight="500">None</Text>;
        return (
          <Box display="flex" width="100%" minWidth={'fit-content'} gap="10px">
            {tags.map((tag, index) => (
              <Tag
                width={'fit-content'}
                maxWidth={'fit-content'}
                key={tag}
                marginRight={
                  tags.length > 3 && index === tags.length ? '10px' : '0px'
                }
                onClick={() => {
                  setSelectedTags([tag]);
                  fetchQuizzes({ tags: tag });
                }}
                borderRadius="5"
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
            ))}
          </Box>
        );
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: ({ createdAt }) => {
        const date = parseISO(createdAt); // parse the date string into a Date object
        const formattedDate = format(date, 'dd-MMMM-yyyy'); // format the date
        return <Text fontWeight="500">{formattedDate}</Text>;
      }
    },
    {
      title: 'Last Attempted',
      key: 'lastAttempted',
      render: ({ scores }) => {
        if (!scores?.length) return <Text>Not Attempted</Text>;
        const date = parseISO(scores[scores.length - 1].date);
        const formattedDate = format(date, 'dd-MMMM-yyyy');
        return (
          <Text fontWeight="500">
            {formattedDate.replace('pm', 'PM').replace('am', 'AM')}
          </Text>
        );
      }
    },
    {
      title: 'Last Attempted Score',
      key: 'lastAttemptedScore',
      render: ({ scores, questions }) => {
        if (!scores?.length) return <Text fontWeight="500">Not Attempted</Text>;
        const percentage = !isNaN(
          (scores[scores.length - 1]?.score / questions.length) * 100
        )
          ? (scores[scores.length - 1]?.score / questions.length) * 100
          : 0;
        const percentageString = percentage.toFixed(0);
        type ColorRange = {
          max: number;
          min: number;
          color: string;
          backgroundColor: string;
        };
        const colorRanges: ColorRange[] = [
          { max: 100, min: 85.1, color: '#4CAF50', backgroundColor: '#EDF7EE' },
          { max: 85, min: 60, color: '#FB8441', backgroundColor: '#FFEFE6' },
          { max: 59.9, min: 0, color: '#F53535', backgroundColor: '#FEECEC' }
        ];

        const { color = '', backgroundColor = '' } = colorRanges.find(
          (range) => percentage <= range.max && percentage >= range.min
        ) as ColorRange;
        return (
          <Box width={'fit-content'}>
            <Box
              padding="5px 10px"
              color={color}
              background={backgroundColor}
              borderRadius={'5px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              <Text fontSize={'14px'} fontWeight="bold">
                {percentageString}%
              </Text>
            </Box>
          </Box>
        );
      }
    },
    {
      title: '',
      key: 'action',
      render: (quiz) => (
        <Menu>
          <MenuButton
            as={Button}
            variant="unstyled"
            borderRadius="full"
            p={0}
            minW="auto"
            height="auto"
          >
            <FaEllipsisH fontSize={'12px'} />
          </MenuButton>
          <MenuList
            fontSize="14px"
            minWidth={'185px'}
            borderRadius="8px"
            backgroundColor="#FFFFFF"
            boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
          >
            {quiz.currentStudy && (
              <MenuItem
                p="6px 8px 6px 8px"
                _hover={{ bgColor: '#F2F4F7' }}
                onClick={() => {
                  loadQuiz(quiz.key, quiz.currentStudy);
                  handleToggleStartQuizModal(true);
                }}
              >
                <Box className="item-menu-icon" marginRight="10px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="10"
                    height="14"
                  >
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                </Box>

                <Text
                  color="#212224"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="400"
                >
                  Resume
                </Text>
              </MenuItem>
            )}
            <MenuItem
              p="6px 8px 6px 8px"
              _hover={{ bgColor: '#F2F4F7' }}
              onClick={() => {
                loadQuiz(quiz.key);
                handleToggleStartQuizModal(true);
              }}
            >
              <Box className="item-menu-icon" marginRight="10px">
                <svg
                  width="10"
                  height="14"
                  viewBox="0 0 10 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5835 5.83301H9.66683L4.41683 13.4163V8.16634H0.333496L5.5835 0.583008V5.83301Z"
                    fill="#6E7682"
                  />
                </svg>
              </Box>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Take
              </Text>
            </MenuItem>
            <MenuItem
              p="6px 8px 6px 8px"
              onClick={() =>
                setScheduleItem({
                  quiz: quiz as unknown as QuizData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <StyledImage marginRight="10px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  width="12"
                  height="12"
                >
                  <path
                    fillRule="evenodd"
                    fill="#6E7682"
                    d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Schedule
              </Text>
            </MenuItem>
            <MenuItem
              p="6px 8px 6px 8px"
              _hover={{ bgColor: '#F2F4F7' }}
              onClick={() => {
                loadQuiz(quiz?.key);
                navigate(`/dashboard/quizzes/create?quiz_id=${quiz?.key}`);
              }}
            >
              <Box className="item-menu-icon" marginRight="10px">
                <IoCreateOutline />
              </Box>
              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Edit
              </Text>
            </MenuItem>{' '}
            <MenuItem
              p="6px 8px 6px 8px"
              onClick={() =>
                setTagEditItem({
                  quiz: quiz as unknown as QuizData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <StyledImage marginRight="10px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    fill="#6E7682"
                    d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </StyledImage>

              <Text
                color="#212224"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="400"
              >
                Edit Tags
              </Text>
            </MenuItem>
            <MenuItem
              p="6px 8px 6px 8px"
              color="#F53535"
              onClick={() =>
                setDeleteItem({
                  quiz: quiz as unknown as QuizData
                })
              }
              _hover={{ bgColor: '#F2F4F7' }}
            >
              <Box className="item-menu-icon" marginRight="10px">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.08317 2.50033V0.750326C3.08317 0.428162 3.34434 0.166992 3.6665 0.166992H8.33317C8.65535 0.166992 8.9165 0.428162 8.9165 0.750326V2.50033H11.8332V3.66699H10.6665V11.2503C10.6665 11.5725 10.4053 11.8337 10.0832 11.8337H1.9165C1.59434 11.8337 1.33317 11.5725 1.33317 11.2503V3.66699H0.166504V2.50033H3.08317ZM4.24984 1.33366V2.50033H7.74984V1.33366H4.24984Z"
                    fill="#F53535"
                  />
                </svg>
              </Box>

              <Text fontSize="14px" lineHeight="20px" fontWeight="400">
                Delete
              </Text>
            </MenuItem>
            <ShareModalMenu type="quiz" id={quiz.key} />
          </MenuList>
        </Menu>
      )
    }
    // rest of your columns...
  ];

  return (
    <>
      {/* {isLoading && <LoaderOverlay />} */}
      {(tagEditItem?.quiz || tagEditItem?.quizIds) && (
        <TagModal
          tags={tagEditItem?.quiz?.tags || []}
          onSubmit={async (d) => {
            const ids =
              tagEditItem?.quizIds || (tagEditItem?.quiz?._id as string);

            const isSaved = await storeQuizTags(ids, d);

            if (isSaved) {
              toast({
                position: 'top-right',
                title: `Tags Added for ${
                  tagEditItem?.quiz?.title || 'Quizzes'
                }`,
                status: 'success'
              });
              setTagEditItem(null);
            } else {
              toast({
                position: 'top-right',
                title: `Failed to add tags for ${
                  tagEditItem?.quiz?.title || ''
                } quiz`,
                status: 'error'
              });
            }
          }}
          onClose={() => setTagEditItem(null)}
          isOpen={Boolean(tagEditItem)}
        />
      )}

      <ScheduleStudyModal
        isLoading={isLoading}
        onSumbit={(d) => handleEventSchedule(d)}
        onClose={() => setScheduleItem(null)}
        isOpen={Boolean(scheduleItem)}
      />

      <DeleteModal
        isLoading={isLoading}
        entity={isEmpty(deleteItem?.quizIds) ? 'Quiz' : 'Quizzes'}
        isOpen={Boolean(deleteItem)}
        onCancel={() => setDeleteItem(null)}
        onDelete={async () => {
          const id = deleteItem?.quiz?._id || deleteItem?.quizIds?.join(',');

          const isDeleted = await deleteQuiz(id as string);
          if (isDeleted) {
            toast({
              position: 'top-right',
              title: isEmpty(deleteItem?.quizIds)
                ? `${deleteItem?.quiz?.title} deleted Succesfully`
                : `Quizzes deleted Succesfully`,
              status: 'success'
            });
            setDeleteItem(null);
          } else {
            toast({
              position: 'top-right',
              title: isEmpty(deleteItem?.quizIds)
                ? `Failed to delete ${deleteItem?.quiz?.title} quiz`
                : `Failed to delete Quizzes`,
              status: 'error'
            });
          }
        }}
        onClose={() => null}
      />
      {isEmpty(quizzes) && !hasSearched && !isLoading ? (
        <Box
          padding={'20px'}
          background={'#F8F9FB'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'start'}
          height={'calc(100vh - 80px)'}
        >
          <Flex
            width="100%"
            alignItems="center"
            justifyContent="space-between"
            color="#E5E6E6"
          >
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize="24px"
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Quizzes
              <span className="count-badge">{0}</span>
            </Text>
          </Flex>
          <Box
            width={'100%'}
            display={'flex'}
            height="100%"
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <img
              src="/images/empty_illustration.svg"
              alt="empty directory icon"
            />
            <Text
              color="text.300"
              fontFamily="Inter"
              fontSize="16px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="21px"
              letterSpacing="0.112px"
            >
              You don't have any quizzes yet!
            </Text>
            <Button
              variant="solid"
              marginTop={'20px'}
              width={{ sm: '80%', md: '300px' }}
              borderRadius={'8px'}
              colorScheme={'primary'}
              onClick={() => {
                loadQuiz(null);
                setTimeout(() => {
                  navigate('/dashboard/quizzes/create');
                }, 100);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <Text marginLeft={'10px'}>Create New</Text>
            </Button>
          </Box>
        </Box>
      ) : (
        <Box padding={'20px'}>
          <Flex className="quiz-header-container">
            <Text
              fontFamily="Inter"
              fontWeight="600"
              fontSize="24px"
              lineHeight="30px"
              letterSpacing="-2%"
              color="#212224"
            >
              Quizzes
              <span className="count-badge">{quizzes?.length || 0}</span>
            </Text>
            <Button
              variant="solid"
              marginLeft={'20px'}
              borderRadius={'10px'}
              colorScheme={'primary'}
              onClick={() => {
                loadQuiz(null);
                setTimeout(() => {
                  navigate('/dashboard/quizzes/create');
                }, 100);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <Text marginLeft={'10px'}>Create a Quiz</Text>
            </Button>
          </Flex>
          {/* <Flex
            width="100%"
            marginBottom="40px"
            alignItems="center"
            justifyContent="space-between"
            paddingRight="20px"
            color="#E5E6E6"
          >
            <Flex alignItems="center">
              <InputGroup width="282px">
                <InputLeftElement
                  pointerEvents="none"
                  children={<BsSearch color="#969CA6" />}
                  ml={2}
                />
                <Input
                  placeholder="Search"
                  pl="48px"
                  _focus={{
                    boxShadow: '0 0 0 2px #3182ce'
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
            </Flex>
            <Flex alignItems="center">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                width={{ base: '100%', md: 'auto' }}
              >
                <MultiSelect
                  options={options}
                  value={multiSelected}
                  onChange={handleSelectionChange}
                  labelledBy="Select"
                  valueRenderer={() => (
                    <span
                      style={{
                        fontWeight: '500',
                        color: 'rgb(110, 118, 130)',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Filter By Tags
                    </span>
                  )}
                />

                <Menu>
                  <MenuButton>
                    <Flex
                      cursor="pointer"
                      border="1px solid #E5E6E6"
                      padding="5px 10px"
                      borderRadius="6px"
                      alignItems="center"
                      mb={{ base: '10px', md: '0' }}
                      width={{ base: '-webkit-fill-available', md: 'auto' }}
                    >
                      <Text
                        fontWeight="400"
                        fontSize={{ base: '12px', md: '14px' }}
                        marginRight="5px"
                        color="#5E6164"
                        width={{ base: '100%', md: 'auto' }}
                      >
                        Sort By
                      </Text>
                      <FaCalendarAlt color="#96999C" size="12px" />
                    </Flex>
                  </MenuButton>
                  <MenuList
                    fontSize="14px"
                    minWidth={'185px'}
                    borderRadius="8px"
                    backgroundColor="#FFFFFF"
                    boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                  >
                    <MenuItem
                      color="#212224"
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => fetchQuizzes({ sort: 'createdAt' })}
                      fontSize="14px"
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Created At
                    </MenuItem>
                    <MenuItem
                      color="#212224"
                      fontSize="14px"
                      onClick={() => fetchQuizzes({ sort: 'lastAttempted' })}
                      _hover={{ bgColor: '#F2F4F7' }}
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Last Attempted
                    </MenuItem>
                    <MenuItem
                      _hover={{ bgColor: '#F2F4F7' }}
                      color="#212224"
                      fontSize="14px"
                      onClick={() => fetchQuizzes({ sort: 'quizname' })}
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Quiz Name
                    </MenuItem>
                  </MenuList>
                </Menu>

                {false && (
                  <Button
                    variant="solid"
                    ml={{ base: '0', md: '20px' }}
                    borderRadius={'10px'}
                    colorScheme={'primary'}
                    width={{ base: '100%', md: 'auto' }}
                    onClick={() => {
                      if (!quizzes) return;
                      const nextFlashCard = findNextQuiz(quizzes);
                      if (!nextFlashCard) {
                        toast({
                          title: 'You have attempted all quizzes for this week',
                          status: 'info'
                        });
                      } else {
                        loadQuiz(nextFlashCard?._id);
                      }
                    }}
                  >
                    <svg
                      width="16"
                      height="18"
                      viewBox="0 0 16 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.83317 4.00033V1.50033C3.83317 1.04009 4.20627 0.666992 4.6665 0.666992H14.6665C15.1267 0.666992 15.4998 1.04009 15.4998 1.50033V13.167C15.4998 13.6272 15.1267 14.0003 14.6665 14.0003H12.1665V16.4996C12.1665 16.9602 11.7916 17.3337 11.3275 17.3337H1.33888C0.875492 17.3337 0.5 16.9632 0.5 16.4996L0.502167 4.83438C0.50225 4.37375 0.8772 4.00033 1.34118 4.00033H3.83317ZM5.49983 4.00033H12.1665V12.3337H13.8332V2.33366H5.49983V4.00033ZM3.83317 8.16699V9.83366H8.83317V8.16699H3.83317ZM3.83317 11.5003V13.167H8.83317V11.5003H3.83317Z"
                        fill="white"
                      />
                    </svg>

                    <Text ml={'10px'}>Take today's quiz</Text>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex> */}
          <Flex
            width="100%"
            marginBottom={{ base: '20px', md: '40px' }} // Responsive margin bottom
            alignItems="center"
            justifyContent="space-between"
            paddingRight="20px"
            color="#E5E6E6"
            direction={{ base: 'column', md: 'row' }}
          >
            <Flex alignItems="center">
              <InputGroup
                width={{ base: '100%', md: '282px' }}
                marginBottom={{ base: '15px', md: '0' }}
              >
                {' '}
                // Responsive width
                <InputLeftElement
                  pointerEvents="none"
                  children={<BsSearch color="#969CA6" />}
                  ml={2}
                />
                <Input
                  placeholder="Search"
                  pl="48px"
                  _focus={{
                    boxShadow: '0 0 0 2px #3182ce'
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </InputGroup>
            </Flex>
            <Flex alignItems="center">
              <Flex
                direction={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'flex-start', md: 'center' }}
                width={{ base: '100%', md: 'auto' }}
              >
                <MultiSelect
                  options={options}
                  value={multiSelected}
                  onChange={handleSelectionChange}
                  labelledBy="Select"
                  valueRenderer={() => (
                    <span
                      style={{
                        fontWeight: '500',
                        color: 'rgb(110, 118, 130)',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Filter By Tags
                    </span>
                  )}
                />

                <Menu>
                  <MenuButton>
                    <Flex
                      cursor="pointer"
                      border="1px solid #E5E6E6"
                      padding="5px 10px"
                      borderRadius="6px"
                      alignItems="center"
                      mb={{ base: '10px', md: '0' }}
                      width={{ base: '100%', md: 'auto' }}
                    >
                      <Text
                        fontWeight="400"
                        fontSize={{ base: '12px', md: '14px' }}
                        marginRight="5px"
                        color="#5E6164"
                        width={{ base: '100%', md: 'auto' }}
                      >
                        Sort By
                      </Text>
                      <FaCalendarAlt color="#96999C" size="12px" />
                    </Flex>
                  </MenuButton>
                  <MenuList
                    fontSize="14px"
                    minWidth={'185px'}
                    borderRadius="8px"
                    backgroundColor="#FFFFFF"
                    boxShadow="0px 0px 0px 1px rgba(77, 77, 77, 0.05), 0px 6px 16px 0px rgba(77, 77, 77, 0.08)"
                  >
                    <MenuItem
                      color="#212224"
                      _hover={{ bgColor: '#F2F4F7' }}
                      onClick={() => fetchQuizzes({ sort: 'createdAt' })}
                      fontSize="14px"
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Created At
                    </MenuItem>
                    <MenuItem
                      color="#212224"
                      fontSize="14px"
                      onClick={() => fetchQuizzes({ sort: 'lastAttempted' })}
                      _hover={{ bgColor: '#F2F4F7' }}
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Last Attempted
                    </MenuItem>
                    <MenuItem
                      _hover={{ bgColor: '#F2F4F7' }}
                      color="#212224"
                      fontSize="14px"
                      onClick={() => fetchQuizzes({ sort: 'quizname' })}
                      lineHeight="20px"
                      fontWeight="400"
                      p="6px 8px 6px 8px"
                    >
                      Quiz Name
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
          </Flex>

          {!isEmpty(selectedQuizzes) && (
            <Box>
              <Button
                variant="solid"
                mb="10px"
                borderRadius={'10px'}
                colorScheme={'#F53535'}
                _hover={{ bg: '#F53535' }}
                bg="#F53535"
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  if (isEmpty(quizzes)) return;
                  setDeleteItem((prev) => ({
                    ...prev,
                    currentDeleteType: 'multiple',
                    quizIds: selectedQuizzes
                  }));
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.83317 4.00033V1.50033C3.83317 1.04009 4.20627 0.666992 4.6665 0.666992H14.6665C15.1267 0.666992 15.4998 1.04009 15.4998 1.50033V13.167C15.4998 13.6272 15.1267 14.0003 14.6665 14.0003H12.1665V16.4996C12.1665 16.9602 11.7916 17.3337 11.3275 17.3337H1.33888C0.875492 17.3337 0.5 16.9632 0.5 16.4996L0.502167 4.83438C0.50225 4.37375 0.8772 4.00033 1.34118 4.00033H3.83317ZM5.49983 4.00033H12.1665V12.3337H13.8332V2.33366H5.49983V4.00033ZM3.83317 8.16699V9.83366H8.83317V8.16699H3.83317ZM3.83317 11.5003V13.167H8.83317V11.5003H3.83317Z"
                    fill="white"
                  />
                </svg>
                <Text ml="5px">
                  Delete {selectedQuizzes?.length > 1 ? 'Quizzess' : 'Quiz'}
                </Text>
              </Button>

              <Button
                variant="solid"
                mb="10px"
                borderRadius={'10px'}
                marginLeft={{ md: '10px', base: '0' }}
                colorScheme={'primary'}
                width={{ base: '100%', md: 'auto' }}
                onClick={() => {
                  if (isEmpty(quizzes)) return;
                  setTagEditItem((prev) => ({
                    ...prev,
                    quizIds: selectedQuizzes
                  }));
                }}
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="white"
                    d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6h.008v.008H6V6z"
                  />
                </svg>

                <Text ml="5px">Add Tag</Text>
              </Button>
            </Box>
          )}
          {!isMobile && quizzes && (
            <SelectableTable
              isSelectable
              columns={columns}
              pagination
              currentPage={pagination.page}
              handlePagination={(nextPage) =>
                fetchQuizzes({ page: nextPage, limit: pagination.limit })
              }
              pageCount={Math.ceil(pagination.count / pagination.limit)}
              onSelect={(selected) => setSelectedQuizzes(selected)}
              dataSource={quizzes.map((card) => ({
                ...card,
                key: card._id
              }))}
            />
          )}

          {isMobile && quizzes && (
            <MobileList
              isSelectable
              columns={columns}
              pagination
              currentPage={pagination.page}
              handlePagination={(nextPage) =>
                fetchQuizzes({ page: nextPage, limit: pagination.limit })
              }
              pageCount={Math.ceil(pagination.count / pagination.limit)}
              onSelect={(selected) => setSelectedQuizzes(selected)}
              dataSource={quizzes.map((card) => ({
                ...card,
                key: card._id
              }))}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default Quizzes;
