import React, { useEffect } from 'react';

import { useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Text,
  Select,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import TimePicker from './TimePicker';
import CustomSelect from './CustomSelect';
import {
  convertTimeToDateTime,
  convertTimeToTimeZone,
  convertToNewFormat,
  convertToPreviousFormat
} from '../util';
// import timezones from './timezones';
import { DeleteIcon } from '@chakra-ui/icons';
import moment from 'moment-timezone';

export default function Availability(props: any) {
  const {
    schedule,
    timezone,
    handleUpdateSchedule,
    handleUpdateTimezone,
    editMode
  } = props;

  const [availability, setAvailability] = useState([]);
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    // Fetch the list of timezones
    const fetchTimezones = () => {
      const zones = moment.tz.names();
      setTimezones(zones);
    };

    fetchTimezones();
  }, []);

  useEffect(() => {
    if (schedule) {
      const availability: any = convertToPreviousFormat(schedule);
      setAvailability(availability);
    }
  }, [schedule]);

  const handleTimeInput = (dayofWeek) => {
    const updatedDays = availability.map((day) => {
      if (day.name === dayofWeek) {
        return {
          ...day,
          times: [
            ...day.times,
            { start: '', end: '' } // Add a new empty time slot
          ]
        };
      }
      return day;
    });
    setAvailability(updatedDays);
    const FormattedSchedule = convertToNewFormat(updatedDays);
    handleUpdateSchedule(FormattedSchedule);
  };

  const handleChangeTimeSlots = (dayIndex, timeIndex, field, value) => {
    const dayy = availability;
    const updatedDays = [...dayy];
    updatedDays[dayIndex].times[timeIndex][field] = value;

    const FormattedSchedule = convertToNewFormat(updatedDays);
    handleUpdateSchedule(FormattedSchedule);
  };

  const handleDeleteTime = (dayIndex, timeIndex) => {
    const dayy = availability;
    const updatedDays = [...dayy];
    updatedDays[dayIndex].times.splice(timeIndex, 1);

    const FormattedSchedule = convertToNewFormat(updatedDays);
    handleUpdateSchedule(FormattedSchedule);
  };

  return (
    <Box className="rounded mb-4">
      {availability.length > 0 && (
        <Box>
          {' '}
          {editMode && (
            <Box w={'50%'} my={2}>
              <FormControl>
                <FormLabel
                  fontStyle="normal"
                  fontWeight={500}
                  fontSize={14}
                  lineHeight="20px"
                  letterSpacing="-0.001em"
                  color="#5C5F64"
                >
                  Time Zone
                </FormLabel>
                <CustomSelect
                  // disabled={!editMode}
                  placeholder="Select a time zone"
                  value={timezone}
                  onChange={(e) => handleUpdateTimezone(e.target.value)}
                >
                  {timezones.map((timezone, index) => (
                    <option value={timezone}>{timezone}</option>
                  ))}
                </CustomSelect>
              </FormControl>
            </Box>
          )}
          <Flex direction="column" gap={2} fontSize={'12px'}>
            {availability.map((day, index) => (
              <Flex
                key={index}
                justify="space-between"
                alignItems="center"
                bg="white"
                p={2}
                rounded="md"
                shadow="md"
                gap={2}
                border="1px solid #E4E5E7 "
              >
                <Box
                  // color="#207df7"
                  fontWeight="bold"
                  py={2}
                  px={2}
                  width={'16%'}
                  roundedLeft="md"
                >
                  {day.name}
                </Box>

                <Flex alignItems="center">
                  <Flex
                    alignItems="center"
                    gap={1}
                    overflowX="scroll"
                    maxWidth={'500px'}
                    className="custom-scroll"
                  >
                    {day.times.map((time, i) => (
                      <Flex
                        bg="#e8f2fe"
                        border={`1px solid #207df7`}
                        color="#207df7"
                        py={1}
                        px={1}
                        rounded="md"
                        textTransform="uppercase"
                        key={i}
                        alignItems="center"
                      >
                        <TimePicker
                          smTime
                          inputGroupProps={{
                            size: 'lg'
                          }}
                          inputProps={{
                            size: 'md',
                            placeholder: '01:00 PM'
                          }}
                          value={
                            editMode
                              ? time.start
                              : convertTimeToTimeZone(
                                  convertTimeToDateTime(time.start),
                                  timezone
                                )
                          }
                          onChange={(v) =>
                            handleChangeTimeSlots(index, i, 'start', v)
                          }
                          isDisabled={!editMode}
                        />
                        -
                        <TimePicker
                          smTime
                          inputGroupProps={{
                            size: 'lg'
                          }}
                          inputProps={{
                            size: 'md',
                            placeholder: '01:00 PM'
                          }}
                          value={
                            editMode
                              ? time.end
                              : convertTimeToTimeZone(
                                  convertTimeToDateTime(time.end),
                                  timezone
                                )
                          }
                          onChange={(v) =>
                            handleChangeTimeSlots(index, i, 'end', v)
                          }
                          isDisabled={!editMode}
                        />
                        {editMode && (
                          <DeleteIcon
                            mx={1}
                            onClick={() => handleDeleteTime(index, i)}
                          />
                        )}
                      </Flex>
                    ))}
                  </Flex>
                  {editMode && (
                    <Button
                      // color="#207df7"
                      // isDisabled={days[index].times.length >= 3}
                      _hover={{ color: 'teal.700' }}
                      variant="unstyled"
                      fontWeight="semibold"
                      py={2}
                      rounded="md"
                      display="inline-flex"
                      alignItems="center"
                      onClick={() => handleTimeInput(day.name)}
                    >
                      <FaPlus className="ml-1" />
                    </Button>
                  )}
                </Flex>
              </Flex>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
