import CalendarDrop from '../../../assets/calendar-drop.svg';
import NoEvent from '../../../assets/no-event.svg';
import ScheduleIcon from '../../../assets/timer.svg';
import Events from '../../../components/Events';
import Calendar from './Calendar';
import './Scheduler/index.css';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Text,
  VStack,
  Image,
  ChakraProvider,
  extendTheme
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import moment from 'moment';

export default function Schedule({ events }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );

  const handleDateClick = (date: any) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  const handleMonthClick = (month: any) => {
    setSelectedDate(null);
    setSelectedMonth(month);
  };

  const filteredEvents =
    selectedDate && events
      ? events.filter(
          (event) =>
            moment.utc(event.date).format('YYYY-MM-DD') ===
            moment(selectedDate).format('YYYY-MM-DD')
        )
      : events;

  const getTomorrowsDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  const filterTomorrowsEvents = () => {
    const tomorrow = getTomorrowsDate();
    return events.filter(
      (event) => new Date(event.date).toDateString() === tomorrow.toDateString()
    );
  };

  const months = [
    { value: 0, label: 'January', id: 1 },
    { value: 1, label: 'February', id: 2 },
    { value: 2, label: 'March', id: 3 },
    { value: 3, label: 'April', id: 4 },
    { value: 4, label: 'May', id: 5 },
    { value: 5, label: 'June', id: 6 },
    { value: 6, label: 'July', id: 7 },
    { value: 7, label: 'August', id: 8 },
    { value: 8, label: 'September', id: 9 },
    { value: 9, label: 'October', id: 10 },
    { value: 10, label: 'November', id: 11 },
    { value: 11, label: 'December', id: 12 }
  ];
  return (
    <>
      <Box>
        {' '}
        <Flex>
          {' '}
          <HStack>
            {/* <img src={ScheduleIcon} alt="feed-icon" width={18} />{' '} */}
            <ScheduleIcon />
            <Text fontSize={16} fontWeight={500} mx={2}>
              Schedule
            </Text>{' '}
          </HStack>
          <Spacer />
          {/* <img src={calendarDrop} alt="schedule-icon" width={45} />{' '} */}
          <Menu>
            <MenuButton
              as={Button}
              variant="unstyled"
              fontSize={14}
              fontWeight={500}
              color="#5C5F64"
              mb={2}
              // h={'32px'}
            >
              {/* <Image src={calendarDrop} alt="schedule-icon" width={45} /> */}
              <CalendarDrop />
            </MenuButton>
            <MenuList minWidth={'auto'}>
              {months.map((month) => (
                <MenuItem
                  key={month.id}
                  _hover={{ bgColor: '#F2F4F7' }}
                  onClick={() => handleMonthClick(month.value)}
                >
                  {month.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>
        <Divider />{' '}
      </Box>{' '}
      <section className="space-y-2">
        <Calendar
          year={moment().year()}
          month={selectedMonth}
          onDayClick={handleDateClick}
        />
        <Box>
          <Text fontSize={12} fontWeight={400} color="text.400" mb={2} px={4}>
            Upcoming Events
          </Text>
          <Box h="280px" overflowY="auto" className="custom-scroll" pb={2}>
            {' '}
            <ul className="space-y-3">
              {selectedDate && filteredEvents && filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <Events key={event.id} event={event} />
                ))
              ) : (
                <Center>
                  <VStack py={3}>
                    <NoEvent />
                    <Text fontSize={12} fontWeight={500} color="text.400">
                      No Events Scheduled
                    </Text>
                  </VStack>
                </Center>
              )}
            </ul>
          </Box>
        </Box>
        {/* <Box>
          <Text fontSize={12} fontWeight={400} color="text.400" my={1} px={4}>
            Tomorrow
          </Text>
          <Box h="85px" overflowY="auto" className="custom-scroll">
            <ul className="space-y-3">
              {selectedDate?.toDateString() === new Date().toDateString() &&
              filterTomorrowsEvents().length > 0 ? (
                filterTomorrowsEvents().map((event) => (
                  <Events key={event.id} event={event} />
                ))
              ) : (
                <Center>
                  <VStack>
                    <NoEvent />
                    <Text fontSize={12} fontWeight={500} color="text.400">
                      No Events Scheduled for tomorrow
                    </Text>
                  </VStack>
                </Center>
              )}
            </ul>
          </Box>
        </Box> */}
      </section>
    </>
  );
}
