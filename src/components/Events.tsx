import ApiService from '../services/ApiService';
import flashcardStore from '../state/flashcardStore';
import { FlashcardData, FlashcardQuestion, SchedulePayload } from '../types';
import {
  convertTimeToDateTime,
  convertTimeToTimeZone,
  convertISOToCustomFormat,
  convertUtcToUserTime
} from '../util';
import ScheduleStudyModal, {
  ScheduleFormState
} from '../views/Dashboard/FlashCards/components/scheduleModal';
import CalendarDateInput from './CalendarDateInput';
import TimePicker from '../components/TimePicker';
import { useCustomToast } from './CustomComponents/CustomToast/useCustomToast';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Button,
  Box,
  Text,
  Flex,
  FormControl,
  FormLabel,
  Spacer,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Center,
  Spinner,
  VStack
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { isSameDay, isThisWeek, getISOWeek } from 'date-fns';
import { parseISO, format, parse } from 'date-fns';
import moment from 'moment-timezone';
import React, { useCallback, useMemo, useState } from 'react';
// import { MdOutlineSentimentNeutral, MdOutlineReplay } from 'react-icons/md';
import { AiOutlineSchedule } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import eventsStore from '../state/eventsStore';
import { Field, Form, Formik } from 'formik';
import StudySession from '../views/Dashboard/FlashCards/forms/flashcard_setup/manual-occlusion-2/_components/study-session';
import { useQuery } from '@tanstack/react-query';
import OccResultsDialog from '../views/Dashboard/FlashCards/forms/flashcard_setup/manual-occlusion-2/_components/study-session/_components/occlusion-result-dialog';
import { cn } from '../library/utils';

export default function Events({ event }: any) {
  const [loading, setLoading] = useState(false);
  console.log('Events', event);

  const {
    isOpen: isOpenReBook,
    onOpen: onOpenReBook,
    onClose: onCloseReBook
  } = useDisclosure();

  const {
    isOpen: isOpenCancelStudy,
    onOpen: onOpenCancelStudy,
    onClose: onCloseCancelStudy
  } = useDisclosure();

  const {
    isOpen: isJoinSessionOpen,
    onOpen: onOpenJoinSession,
    onClose: onCloseJoinSession
  } = useDisclosure();

  const today = useMemo(() => new Date(), []);

  const getTextByEventType = (eventType, name) => {
    switch (eventType) {
      case 'flashcard':
        return `Flashcard deck "${name}" practice`;
      case 'booking':
        return `${name.subject} lesson with ${name.tutor} `;
      case 'quiz':
        return `"${name}" quiz practice`;
      // case 'study':
      //   return `"${name}" review`;

      default:
        return undefined;
    }
  };

  const getBgColorByEventType = (eventType) => {
    switch (eventType) {
      case 'flashcard':
        return `bg-green-500`;
      case 'booking':
        return `bg-orange-500`;
      case 'quiz':
        return `bg-blue-500`;

      default:
        return `bg-pink-500`;
    }
  };
  const getColorByEventType = (eventType) => {
    switch (eventType) {
      case 'flashcard':
        return `bg-green-50`;
      case 'booking':
        return `bg-orange-50`;
      case 'quiz':
        return `bg-blue-50`;

      default:
        return `bg-pink-50`;
    }
  };
  const getHoverColorByEventType = (eventType) => {
    switch (eventType) {
      case 'flashcard':
        return `hover:bg-emerald-50`;
      case 'booking':
        return `hover:bg-amber-50`;
      case 'quiz':
        return `hover:bg-indigo-50`;

      default:
        return `hover:bg-rose-50`;
    }
  };

  const navigate = useNavigate();

  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const { isLoading, rescheduleFlashcard, fetchSingleFlashcard } =
    flashcardStore();
  const { fetchEvents } = eventsStore();

  const toast = useCustomToast();

  const [scheduleItem, setScheduleItem] = useState(null);
  const [reScheduleItem, setReScheduleItem] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState<Date>();

  const handleEventSchedule = async (data: ScheduleFormState) => {
    const parsedTime = parse(data.time.toLowerCase(), 'hh:mm aa', new Date());
    const time = format(parsedTime, 'HH:mm');
    const day = moment(data.day).format('YYYY-MM-DD');

    const rePayload = {
      eventId: scheduleItem._id,
      updates: {
        startDate: moment(day).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') as string,
        startTime: time,
        isActive: true
      }
    };

    const isSuccess = await rescheduleFlashcard(rePayload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.entity.deckname} Rescheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
      fetchEvents();
    } else {
      toast({
        position: 'top-right',
        title: `Failed to reschedule ${scheduleItem?.entity.deckname} flashcards`,
        status: 'error'
      });
    }
  };

  const rebook = async (formattedStartDateTime, formattedEndDateTime) => {
    const payload = {
      bookingId: scheduleItem._id,
      updates: {
        startDate: formattedStartDateTime,
        endDate: formattedEndDateTime
      }
    };
    const response = await ApiService.reScheduleBooking(payload);
    if (response.status === 200) {
      toast({
        position: 'top-right',
        title: `Booking Rescheduled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
      onCloseReBook();
      fetchEvents();
    } else {
      toast({
        position: 'top-right',
        title: `Failed to reschedule booking`,
        status: 'error'
      });
    }
  };

  const handleCancelEvent = async () => {
    const rePayload = {
      eventId: scheduleItem._id,
      updates: {
        startDate: moment()
          .startOf('day')
          .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') as string,
        startTime: '00:00',
        isActive: false
      }
    };

    const isSuccess = await rescheduleFlashcard(rePayload);
    if (isSuccess) {
      toast({
        position: 'top-right',
        title: `${scheduleItem?.entity.deckname} Study Canceled Succesfully`,
        status: 'success'
      });
      setScheduleItem(null);
      onCloseCancelStudy();
      fetchEvents();
    } else {
      toast({
        position: 'top-right',
        title: `Failed to cancel ${scheduleItem?.entity.deckname} flashcard study`,
        status: 'error'
      });
    }
  };

  const handleJoinSession = (url) => {
    window.open(url, '_blank');
    onCloseJoinSession();
  };

  const handleMessageStudent = () => {
    navigate('/dashboard/tutordashboard/messages');
  };

  const handleMessageTutor = () => {
    navigate('/dashboard/messaging');
  };

  const cancelSession = async () => {
    setLoading(true);
    try {
      const response = await ApiService.cancelBooking({ id: scheduleItem._id });
      if (response.status === 200) {
        toast({
          position: 'top-right',
          title: `Booking canceled Succesfully`,
          status: 'success'
        });
        fetchEvents();
      } else {
        toast({
          position: 'top-right',
          title: `Failed to cancel booking`,
          status: 'error'
        });
      }
    } catch (error) {
      toast({
        position: 'top-right',
        title: `An error occurred while canceling booking`,
        status: 'error'
      });
    } finally {
      setScheduleItem(null);
      onCloseJoinSession();
      setLoading(false);
    }
  };

  const addEventToGoogleCalendar = () => {
    const data = event.data;
    const eventTitle = encodeURIComponent(
      `${data?.offer?.course?.label} lesson with ${data?.offer?.tutor?.user?.name?.first} ${data?.offer?.tutor?.user?.name?.last}`
    );

    const formatForCalendar = (date) => {
      return date.replace(/-|:|\.\d\d\d/g, '');
    };

    const startDate = formatForCalendar(data.startDate);
    const endDate = formatForCalendar(data.endDate);
    const location = encodeURIComponent(
      data.conferenceHostRoomUrl || data.conferenceRoomUrl
    );
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${startDate}/${endDate}&details=&location=${location}`;
    window.open(url, '_blank');
    onCloseJoinSession();
  };

  if (event.type === 'study' && event.data.entityType === 'occlusionCard') {
    return (
      <li className="flex w-full cursor-pointer">
        <ImageOcclusionItem
          id={event.data.entity._id as string}
          time={event.data.startDate}
        />
      </li>
    );
  }
  return (
    <li
      className={`flex gap-x-3 cursor-pointer hover:drop-shadow-sm ${getColorByEventType(
        event.type === 'study' ? event.data.entityType : event.type
      )} ${getHoverColorByEventType(
        event.type === 'study' ? event.data.entityType : event.type
      )}`}
      onClick={() => {
        if (event.type === 'study') {
          if (event.data.entityType === 'flashcard') {
            fetchSingleFlashcard(event.data.entity.id);
          } else if (event.data.entityType === 'quiz') {
            navigate(`/dashboard/quizzes/take?quiz_id=${event.data.entity.id}`);
          }
        } else if (event.type === 'booking') {
          setScheduleItem(event.data);
          onOpenJoinSession();
        } else {
          navigate(`${`/dashboard`}`);
        }
      }}
    >
      <div
        className={`min-h-fit w-1 rounded-tr-full rounded-br-full ${getBgColorByEventType(
          event.type === 'study' ? event.data.entityType : event.type
        )}`}
      />
      <div className="py-2 w-full">
        <div className="flex gap-x-1">
          <div className="min-w-0 flex-auto">
            <Text className="text-xs font-normal leading-6 text-gray-500">
              {getTextByEventType(
                event.type === 'study' ? event.data.entityType : event.type,
                event.data.entity?.deckname
                  ? event.data.entity.deckname
                  : event.data.entity?.title
                  ? event.data.entity?.title
                  : {
                      subject: event.data?.offer?.course?.label,
                      tutor: `${event.data?.offer?.tutor?.user?.name?.first} ${event.data?.offer?.tutor?.user?.name?.last}`
                    }
              )}
            </Text>
            <Flex alignItems={'center'}>
              {' '}
              <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
                <span>{convertUtcToUserTime(event.data.startDate)}</span>
                {event.type !== 'study' && (
                  <>
                    {' '}
                    <ChevronRightIcon className="w-4 h-4" />
                    <span>{convertUtcToUserTime(event.data.endDate)}</span>
                  </>
                )}
              </Text>
              <Spacer />
              <HStack color="#6b7280" mx={2}>
                {' '}
                {event.type === 'booking' &&
                moment(event.data.startDate).isBefore(
                  moment.utc().add(24, 'hours')
                ) ? (
                  ''
                ) : (
                  <AiOutlineSchedule
                    onClick={(e) => {
                      e.stopPropagation();
                      setScheduleItem(event.data);
                      event.type === 'study'
                        ? setReScheduleItem(true)
                        : onOpenReBook();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                )}
                {event.type !== 'booking' && (
                  <CloseIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      setScheduleItem(event.data);
                      onOpenCancelStudy();
                    }}
                    boxSize={2}
                  />
                )}
              </HStack>
            </Flex>
          </div>
        </div>
      </div>

      <Modal isOpen={isJoinSessionOpen} onClose={onCloseJoinSession}>
        <ModalOverlay />
        <ModalContent maxW="xs">
          <ModalHeader>Session Options</ModalHeader>
          <ModalCloseButton />
          {loading ? (
            <ModalBody>
              <Center>
                <Spinner />
              </Center>
            </ModalBody>
          ) : (
            <ModalBody p={4}>
              <VStack spacing={4} width="full">
                <Button
                  colorScheme="green"
                  width="full"
                  onClick={addEventToGoogleCalendar}
                >
                  Add to Google Calendar
                </Button>
                <Button
                  colorScheme="blue"
                  width="full"
                  onClick={() =>
                    handleJoinSession(
                      event.data.conferenceHostRoomUrl ||
                        event.data.conferenceRoomUrl
                    )
                  }
                >
                  Join the session
                </Button>
                <Button
                  colorScheme="green"
                  width="full"
                  onClick={isTutor ? handleMessageStudent : handleMessageTutor}
                >
                  {isTutor ? 'Message Student' : 'Message Tutor'}
                </Button>
                <Button colorScheme="red" width="full" onClick={cancelSession}>
                  Cancel Session
                </Button>
              </VStack>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <ScheduleStudyModal
        isLoading={isLoading}
        onSumbit={(d) => handleEventSchedule(d)}
        onClose={() => setReScheduleItem(false)}
        isOpen={reScheduleItem}
      />

      <Modal isOpen={isOpenReBook} onClose={onCloseReBook}>
        <ModalOverlay />
        <ModalContent
          minWidth={{ base: '80%', md: '500px' }}
          // minHeight={{ base: '80%', md: '500px' }}
          height={{ base: '80%', md: '540px' }}
          mx="auto"
          // w="fit-content"
          borderRadius="10px"
        >
          <ModalHeader>Reschedule Booking</ModalHeader>
          <ModalCloseButton />
          <Flex direction="column" height="100%" justifyContent="space-between">
            <Formik
              initialValues={{ newDate: null, startTime: '', endTime: '' }}
              onSubmit={(values, actions) => {
                const formattedStartDateTimeString =
                  moment(values.newDate).format('YYYY-MM-DD') +
                  'T' +
                  moment(values.startTime, 'hh:mm A').format('HH:mm:ss');
                const formattedEndDateTimeString =
                  moment(values.newDate).format('YYYY-MM-DD') +
                  'T' +
                  moment(values.endTime, 'hh:mm A').format('HH:mm:ss');
                const formattedStartDateTime = moment(
                  formattedStartDateTimeString
                ).toDate();
                const formattedEndDateTime = moment(
                  formattedEndDateTimeString
                ).toDate();

                rebook(formattedStartDateTime, formattedEndDateTime);

                actions.setSubmitting(false);
              }}
            >
              {({ setFieldValue, values, isSubmitting }) => (
                <Form
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                >
                  <ModalBody>
                    <Box flex="1" height={'100%'}>
                      <Field name="newDate">
                        {({ field }) => (
                          <FormControl id="newDate" marginBottom="20px">
                            <FormLabel>Date</FormLabel>
                            <CalendarDateInput
                              disabledDate={{
                                before: moment().add(1, 'days').toDate()
                              }}
                              inputProps={{
                                placeholder: 'Select Date',
                                ...field
                              }}
                              value={values.newDate}
                              onChange={(value) => {
                                setFieldValue('newDate', value);
                              }}
                            />
                          </FormControl>
                        )}
                      </Field>
                      {values.newDate && (
                        <>
                          <Field name="startTime">
                            {({ field }) => (
                              <FormControl>
                                <FormLabel>Start time</FormLabel>
                                <TimePicker
                                  inputProps={{
                                    placeholder: '00:00 AM',
                                    ...field
                                  }}
                                  value={values.startTime}
                                  onChange={(time) =>
                                    setFieldValue('startTime', time)
                                  }
                                />
                              </FormControl>
                            )}
                          </Field>
                          <br />
                          <Field name="endTime">
                            {({ field }) => (
                              <FormControl>
                                <FormLabel>End time</FormLabel>
                                <TimePicker
                                  inputProps={{
                                    placeholder: '00:00 AM',
                                    ...field
                                  }}
                                  value={values.endTime}
                                  onChange={(time) =>
                                    setFieldValue('endTime', time)
                                  }
                                />
                              </FormControl>
                            )}
                          </Field>
                        </>
                      )}
                    </Box>
                  </ModalBody>
                  <ModalFooter
                    bg="#F7F7F8"
                    borderRadius="0px 0px 10px 10px"
                    p="16px"
                    justifyContent="flex-end"
                  >
                    <Button
                      type="submit"
                      isDisabled={isSubmitting || !values.newDate}
                      _hover={{
                        backgroundColor: '#207DF7',
                        boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
                      }}
                      bg="#207DF7"
                      color="#FFF"
                      fontSize="14px"
                      fontFamily="Inter"
                      fontWeight="500"
                      lineHeight="20px"
                      isLoading={isSubmitting}
                      borderRadius="8px"
                      boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
                      mr={3}
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </Flex>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenCancelStudy} onClose={onCloseCancelStudy}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Study Cancellation</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto" py={3} px={8}>
            <VStack
              justifyContent={'center'}
              // padding={'40px'}
              alignItems="center"
              spacing={1}
            >
              <svg
                width="73"
                height="52"
                viewBox="0 0 73 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_2506_16927)">
                  <circle cx="36.5" cy="28" r="20" fill="white" />
                  <circle
                    cx="36.5"
                    cy="28"
                    r="19.65"
                    stroke="#EAEAEB"
                    stroke-width="0.7"
                  />
                </g>
                <path
                  d="M36.5002 37.1663C31.4376 37.1663 27.3335 33.0622 27.3335 27.9997C27.3335 22.9371 31.4376 18.833 36.5002 18.833C41.5627 18.833 45.6668 22.9371 45.6668 27.9997C45.6668 33.0622 41.5627 37.1663 36.5002 37.1663ZM35.5835 30.7497V32.583H37.4168V30.7497H35.5835ZM35.5835 23.4163V28.9163H37.4168V23.4163H35.5835Z"
                  fill="#F53535"
                />
                <defs>
                  <filter
                    id="filter0_d_2506_16927"
                    x="0.5"
                    y="0"
                    width="72"
                    height="72"
                    filterUnits="userSpaceOnUse"
                    color-interpolation-filters="sRGB"
                  >
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="8" />
                    <feGaussianBlur stdDeviation="8" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.32 0 0 0 0 0.389333 0 0 0 0 0.48 0 0 0 0.11 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_2506_16927"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_2506_16927"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>

              <Text fontWeight={600} fontSize={16}>
                Cancel Study Event ?{' '}
              </Text>
              <Text textAlign={'center'}>
                {' '}
                This will permanently remove {
                  scheduleItem?.entity?.deckname
                }{' '}
                from your schedule
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter
            bg="#F7F7F8"
            borderRadius="0px 0px 10px 10px"
            p="16px"
            justifyContent="flex-end"
          >
            <Button
              _hover={{
                backgroundColor: 'red',
                boxShadow: '0px 2px 6px 0px rgba(136, 139, 143, 0.10)'
              }}
              bg="red"
              color="#FFF"
              fontSize="14px"
              fontFamily="Inter"
              fontWeight="500"
              lineHeight="20px"
              onClick={() => handleCancelEvent()}
              isLoading={isLoading}
              borderRadius="8px"
              boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
              mr={3}
              variant="primary"
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </li>
  );
}

const ImageOcclusionItem = ({ id, time }: { id: string; time: string }) => {
  const initialState = {
    open: false,
    id: '',
    score: {
      right: 0,
      wrong: 0,
      notRemembered: 0
    },
    quizOver: false,
    showResults: false
  };
  const date = new Date(time);
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const isPM = hours >= 12;
  hours = hours % 12 || 12;
  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const amPm = isPM ? 'PM' : 'AM';
  const timeString = `${paddedHours}:${paddedMinutes} ${amPm}`;
  const [state, setState] = useState(initialState);
  const { data, isLoading } = useQuery({
    queryKey: ['occlusion-card', id],
    queryFn: () => ApiService.getOcclusionCard(id).then((res) => res.json()),
    enabled: Boolean(id),
    select: (data) => data.card,
    refetchOnWindowFocus: false
  });

  const handleOpen = useCallback((id: string) => {
    setState((pS) => ({
      ...pS,
      open: true,
      id
    }));
  }, []);

  const handleClose = useCallback(() => {
    setState((pS) => ({
      ...pS,
      open: false
    }));
  }, []);

  const setQuizOver = useCallback((input: boolean) => {
    setState((pS) => ({
      ...pS,
      quizOver: input
    }));
  }, []);

  const showResults = useCallback((input: boolean) => {
    setState((prevState) => ({
      ...prevState,
      showResults: input
    }));
  }, []);

  const setScore = useCallback((score) => {
    setState((prevState) => ({
      ...prevState,
      score
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState(initialState);
  }, []);

  function handleCloseResults() {
    setState((pS) => {
      return {
        ...pS,
        quizOver: false,
        showResults: false,
        score: {
          notRemembered: 0,
          right: 0,
          wrong: 0
        }
      };
    });
  }

  const handleRestart = useCallback(() => {
    setState((pS) => ({
      ...pS,
      open: true,
      score: {
        notRemembered: 0,
        right: 0,
        wrong: 0
      },
      showResults: false,
      quizOver: false
    }));
  }, []);

  if (isLoading) return null;

  return (
    <>
      <div
        role="button"
        className={cn(
          'image-occlusion rounded-md bg-blue-100 border-l-2 border-blue-600 flex gap-3 cursor-pointer hover:drop-shadow-sm p-3 w-full flex-col',
          {
            'pointer-events-none': isLoading
          }
        )}
        onClick={() => handleOpen(id)}
      >
        <p className="text-xs">
          {isLoading
            ? 'Loading...'
            : 'Image Occlusion "' + data.title + '" practice'}
        </p>
        <p className="text-xs">{isLoading ? 'Loading...' : timeString}</p>
      </div>
      <StudySession
        id={state.id}
        open={state.open}
        close={handleClose}
        quizOver={state.quizOver}
        setQuizOver={setQuizOver}
        score={state.score}
        setOpenResults={showResults}
        setScore={setScore}
        resetForm={handleReset}
      />
      <OccResultsDialog
        id={state.id}
        open={state.showResults}
        score={state.score}
        close={handleCloseResults}
        restartStudySession={handleRestart}
        handleEditImage={() => null}
        editImageDisabled={true}
      />
    </>
  );
};
