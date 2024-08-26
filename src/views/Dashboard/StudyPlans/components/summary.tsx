import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react';
import CloudDay from '../../../../assets/day.svg';
import CloudNight from '../../../../assets/night.svg';
import React, { useState, useEffect } from 'react';
import { RiCalendar2Fill } from 'react-icons/ri';
import { BsChevronDown } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { numberToDayOfWeekName } from '../../../../util';
import moment from 'moment';
import userStore from '../../../../state/userStore';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

function StudyPlanSummary(props) {
  const { user } = userStore();

  const { data, onEventClick } = props;
  const [eventPeriod, setEventPeriod] = useState('all');

  // Define state variables for filtered events
  const [eventsToday, setEventsToday] = useState([]);
  const [eventsTomorrow, setEventsTomorrow] = useState([]);
  const [eventsRestOfWeek, setEventsRestOfWeek] = useState([]);
  const [eventsNextWeek, setEventsNextWeek] = useState([]);
  const [eventsNextMonth, setEventsNextMonth] = useState([]);
  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  // console.log(studyPlanCourses);

  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;

  //SUMMARY FILTER BY PERIOD

  // Define the start and end dates for the current month

  const currentDate = moment();
  const tomorrowDate = moment().add(1, 'day');
  const endOfWeekDate = moment().endOf('week');
  const endOfNextWeekDate = moment().add(1, 'week').endOf('week');
  const endOfMonthDate = moment().endOf('month');
  const nextMonthDate = moment().add(1, 'month').endOf('month');

  // Update filtered events whenever studyPlanUpcomingEvent changes
  useEffect(() => {
    if (!data) return; // Ensure data is not null or undefined

    // Filter events for today
    const filteredEventsToday = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isSame(currentDate, 'day');
    });
    setEventsToday(filteredEventsToday);

    // Filter events for tomorrow
    const filteredEventsTomorrow = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isSame(tomorrowDate, 'day');
    });
    setEventsTomorrow(filteredEventsTomorrow);

    // Filter events for rest of the week
    const filteredEventsRestOfWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(currentDate, endOfWeekDate, null, '[]');
    });
    setEventsRestOfWeek(filteredEventsRestOfWeek);

    // Filter events for next week
    const filteredEventsNextWeek = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(endOfWeekDate, endOfNextWeekDate, null, '[]');
    });
    setEventsNextWeek(filteredEventsNextWeek);

    // Filter events for next month
    const filteredEventsNextMonth = data.filter((event) => {
      const eventDate = moment(event.startDate);
      return eventDate.isBetween(endOfMonthDate, nextMonthDate, null, '[]');
    });
    setEventsNextMonth(filteredEventsNextMonth);
  }, [data]);

  const getEventList = (events) => {
    const handleEventClick = (entityId, selectedTopic) => {
      // Pass entityId and selectedTopic to the parent component
      onEventClick(entityId, selectedTopic);
    };

    const getColorForEntityId = (entityId) => {
      // Convert entityId to a numeric value
      const numericValue = entityId
        .split('')
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      // Map the numeric value to a color
      const colorIndex = numericValue % colorPalette.length;
      return colorPalette[colorIndex];
    };

    const colorPalette = [
      '#FF5733',
      '#33FF57',
      '#5733FF',
      '#FF33A1',
      '#33B8FF',
      '#F4FF33',
      '#337DFF',
      '#7D33FF',
      '#FF5D33'
    ];

    return events.map((event) => {
      const eventColor = getColorForEntityId(event.entityId);
      return (
        <li
          key={event._id}
          className={`flex gap-x-3 cursor-pointer hover:drop-shadow-sm bg-gray-50`}
          // onClick={(e) => {
          //   e.stopPropagation();

          //   updateState({
          //     selectedTopic: event.metadata.topicId,
          //     selectedPlan: event.entityId
          //   });
          // }}
          onClick={() =>
            handleEventClick(event.entityId, event.metadata.topicId)
          }
        >
          <div
            className={`min-h-fit w-1 rounded-tr-full rounded-br-full bg-red-500`}
            style={{ backgroundColor: eventColor }}
          />
          <div className="py-2 w-full">
            <div className="flex gap-x-1">
              <div className="min-w-0 flex-auto">
                <Text className="text-xs font-normal leading-6 text-gray-500">
                  {event.topic.label}
                </Text>
                <Flex alignItems={'center'}>
                  <Text className="mt-1 flex items-center truncate text-xs leading-5 text-gray-500">
                    <span>{event.startTime}</span>
                  </Text>
                </Flex>
              </div>
            </div>
          </div>
        </li>
      );
    });
  };

  const SummaryPeriod = ({ data, period }) => {
    const [visible, setVisible] = useState(period === 'Today' ? true : false);
    const toggleVisibility = () => {
      setVisible(!visible);
    };
    return (
      <>
        <Flex alignItems={'center'}>
          {' '}
          <Text
            className="text-[#585F68] font-normal text-xs mb-4"
            textTransform={'uppercase'}
            my={2}
          >
            {period}
          </Text>
          <Spacer />
          {visible ? (
            <AiOutlineDown size="12px" onClick={() => toggleVisibility()} />
          ) : (
            <AiOutlineUp size="12px" onClick={() => toggleVisibility()} />
          )}
        </Flex>
        {visible &&
          (data.length > 0 ? (
            getEventList(data)
          ) : (
            <Text fontSize={12} textAlign="center" color={'text.300'}>
              no events
            </Text>
          ))}
      </>
    );
  };
  return (
    <>
      <Box py={8} px={4} className="schedule" bg="white" overflowY="auto">
        <Flex
          color="text.300"
          fontSize={12}
          fontWeight={400}
          alignItems="center"
          height="fit-content"
          justifyContent="right"
        >
          <Box>{isDayTime ? <CloudDay /> : <CloudNight />}</Box>
          <Box mt={1}>
            <RxDotFilled />
          </Box>
          <Text mb={0}>{`${weekday}, ${month} ${monthday}`}</Text>
        </Flex>
        <Box my={4} fontSize={16}>
          <Text fontWeight={500}>Hey {user?.name?.first || 'User'}</Text>
          <Text color={'text.300'} fontSize={13}>
            {/* {` You have
        ${data ? data.length : 0}
        topics to study before your big-day.`} */}
            Here is a list of topics you should check out between now and next
            month
          </Text>
        </Box>
        <Box mt={4}>
          <Text fontSize={14} py={3} fontWeight={500}>
            Summary
          </Text>

          <ul className="space-y-3">
            {data?.length > 0 ? (
              <>
                <SummaryPeriod data={eventsToday} period={'Today'} />
                <SummaryPeriod data={eventsTomorrow} period={'Tomorrow'} />
                <SummaryPeriod
                  data={eventsRestOfWeek}
                  period="Rest of the week"
                />
                <SummaryPeriod data={eventsNextWeek} period={'Next Week'} />
                <SummaryPeriod data={eventsNextMonth} period={'Next Month'} />

                {/* {getEventList(eventsThisMonth)} */}
                {/* {getEventList(data, 'all')} */}
              </>
            ) : (
              <Text fontSize={12} textAlign="center" color={'text.300'}>
                no upcoming events
              </Text>
            )}
          </ul>
        </Box>
      </Box>
    </>
  );
}

export default StudyPlanSummary;
