import CustomDropdown from '../../../components/CustomDropdown';
import CustomSelect from '../../../components/CustomSelect';
import onboardTutorStore from '../../../state/onboardTutorStore';
import { Schedule, TimeSchedule } from '../../../types';
import timezones from '../../OnboardTutor/components/steps/timezones';
import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Stack,
  VStack
} from '@chakra-ui/react';
import { Flex, Button, Fade } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';

export type Availability = { [key: string]: SlotData };
export interface SlotData {
  timezone: string;
  slots: string[];
}

interface MyComponentProps {
  onConfirm: (d: string[], timezone: string) => void;
  day: string;
  value?: SlotData;
}
const slotTimes: { [key: string]: any } = {
  slot1: '8AM → 12PM',
  slot2: '12PM → 5PM',
  slot3: '5PM → 9PM',
  slot4: '9PM → 12AM'
};

function SelectTimeSlot({ onConfirm, day, value }: MyComponentProps) {
  const [selectedSlot, setSelectedSlot] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('Timezone');

  const handleSlotClick = (slot: string) => {
    setSelectedSlot((prev) => {
      if (prev.includes(slot)) {
        const index = prev.findIndex((pre) => pre === slot);
        prev.splice(index, 1);
      } else {
        prev.push(slot);
      }
      return [...prev];
    });
  };

  const handleConfirm = () => {
    const timeSlot = selectedSlot.map((slot) => slotTimes[slot]);
    return onConfirm(timeSlot, timezone);
  };

  function getKeyByValue(object: { [key: string]: any }, value: string) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  useEffect(() => {
    setSelectedSlot(
      value?.slots
        ? value.slots
            ?.filter((slot) => {
              return getKeyByValue(slotTimes, slot.replace(' - undefined', ''));
            })
            ?.map(
              (slot) =>
                getKeyByValue(
                  slotTimes,
                  slot.replace(' - undefined', '')
                ) as string
            )
        : []
    ); // Reset selected slots

    setTimezone(value?.timezone ? value.timezone : ''); // Reset timezone
  }, [day, value?.slots, value?.timezone]);

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const transition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  };

  return (
    <Box width="100%">
      {/* Upper Section */}
      <AnimatePresence>
        (
        <motion.div
          key={day}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={transition}
        >
          <Flex direction="column" bg="white" borderRadius="6px" p={4} mb={4}>
            <VStack spacing={4} alignItems="center">
              <FormControl>
                <FormLabel
                  fontStyle="normal"
                  fontWeight={500}
                  fontSize={14}
                  lineHeight="20px"
                  letterSpacing="-0.001em"
                  color="#5C5F64"
                >
                  What time on {day} will you be available
                </FormLabel>
                <Box display="flex">
                  {/* Badge 1 */}
                  <Box
                    bg={selectedSlot.includes('slot1') ? '#EBF4FE' : 'white'}
                    color={
                      !selectedSlot.includes('slot1') ? '#9A9DA2' : '#212224'
                    }
                    fontWeight={400}
                    fontSize="14px"
                    lineHeight="20px"
                    letterSpacing="-0.003em"
                    flex="1"
                    display={'flex'}
                    justifyContent={'center'}
                    justifyItems={'center'}
                    border={`1.4px solid ${
                      selectedSlot.includes('slot1') ? '#207DF7' : '#E4E5E7'
                    }`}
                    boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                    borderRadius="6px 0px 0px 6px"
                    p={2}
                    onClick={() => handleSlotClick('slot1')}
                    _hover={{ bg: '#EBF4FE' }}
                    cursor="pointer"
                  >
                    8AM → 12PM
                  </Box>
                  {/* Badge 2 */}
                  <Box
                    bg={selectedSlot.includes('slot2') ? '#EBF4FE' : 'white'}
                    color={
                      !selectedSlot.includes('slot2') ? '#9A9DA2' : '#212224'
                    }
                    fontWeight={400}
                    fontSize="14px"
                    lineHeight="20px"
                    display={'flex'}
                    justifyContent={'center'}
                    justifyItems={'center'}
                    letterSpacing="-0.003em"
                    flex="1"
                    border={`1.4px solid ${
                      selectedSlot.includes('slot2') ? '#207DF7' : '#E4E5E7'
                    }`}
                    boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                    p={2}
                    onClick={() => handleSlotClick('slot2')}
                    _hover={{ bg: '#EBF4FE' }}
                    cursor="pointer"
                  >
                    12PM → 5PM
                  </Box>
                  {/* Badge 3 */}
                  <Box
                    bg={selectedSlot.includes('slot3') ? '#EBF4FE' : 'white'}
                    color={
                      !selectedSlot.includes('slot3') ? '#9A9DA2' : '#212224'
                    }
                    fontWeight={400}
                    fontSize="14px"
                    lineHeight="20px"
                    display={'flex'}
                    justifyContent={'center'}
                    justifyItems={'center'}
                    letterSpacing="-0.003em"
                    flex="1"
                    border={`1.4px solid ${
                      selectedSlot.includes('slot3') ? '#207DF7' : '#E4E5E7'
                    }`}
                    boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                    p={2}
                    onClick={() => handleSlotClick('slot3')}
                    _hover={{ bg: '#EBF4FE' }}
                    cursor="pointer"
                  >
                    5PM → 9PM
                  </Box>
                  <Box
                    bg={selectedSlot.includes('slot4') ? '#EBF4FE' : 'white'}
                    color={
                      !selectedSlot.includes('slot4') ? '#9A9DA2' : '#212224'
                    }
                    fontWeight={400}
                    fontSize="14px"
                    lineHeight="20px"
                    display={'flex'}
                    justifyContent={'center'}
                    justifyItems={'center'}
                    letterSpacing="-0.003em"
                    flex="1"
                    border={`1.4px solid ${
                      selectedSlot.includes('slot4') ? '#207DF7' : '#E4E5E7'
                    }`}
                    boxShadow="0px 2px 6px rgba(136, 139, 143, 0.1)"
                    borderRadius="0px 6px 6px 0px"
                    p={2}
                    onClick={() => handleSlotClick('slot4')}
                    _hover={{ bg: '#EBF4FE' }}
                    cursor="pointer"
                  >
                    9PM → 12AM
                  </Box>
                </Box>
              </FormControl>
            </VStack>
          </Flex>
        </motion.div>
        )
      </AnimatePresence>

      {/* Footer */}
      <Fade in={true} unmountOnExit>
        <Flex
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p={4}
          justifyContent="flex-end"
        >
          <Button
            isDisabled={[selectedSlot.length].some((v) => !v)}
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </Flex>
      </Fade>
    </Box>
  );
}

const AvailabilityEditForm = (props) => {
  const { updateSchedule } = props;

  const { schedule, tz: timezone } = onboardTutorStore.useStore();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [shouldFormatAvailability, setShouldFormatAvailability] =
    useState(true);
  const [availability, setTutorAvailability] = useState<{
    [key: string]: SlotData;
  }>({});

  const availabilityDays = Object.keys(availability);

  const dayMap: { [key: string]: number } = useMemo(
    () => ({
      sunday: 1,
      monday: 2,
      tuesday: 3,
      wednesday: 4,
      thursday: 5,
      friday: 6,
      saturday: 7
    }),
    []
  );

  const timezoneTextValue = useMemo(() => {
    const dayMap: { [key: number]: string } = {
      1: 'Sunday',
      2: 'Monday',
      3: 'Tuesday',
      4: 'Wednesday',
      5: 'Thursday',
      6: 'Friday',
      7: 'Saturday'
    };

    const scheduleTextArray = Object.keys(schedule).map((dayNumber) => {
      const dayText = dayMap[parseInt(dayNumber)];
      const timeSlots = schedule[parseInt(dayNumber)];
      const timeSlotsText = timeSlots.map(({ begin, end }) =>
        `${begin} -> ${end}`.replace(' -> undefined', '')
      );
      return `${dayText}: ${timeSlotsText.join('; ')}`;
    });

    const result = scheduleTextArray.join('; ');

    // Truncate and add ellipsis if result has more than 12 characters
    return result.length > 12 ? result.slice(0, 25) + '...' : result;
  }, [schedule]);

  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [previousDayIndex, setPreviousDayIndex] = useState(0);

  const totalDayIndex = useMemo(
    () => availabilityDays.length - 1,
    [availabilityDays.length]
  );

  const isLastDayToFirstDay = useMemo(() => {
    if (!totalDayIndex) return false;
    return previousDayIndex === totalDayIndex;
  }, [previousDayIndex, totalDayIndex]);

  useEffect(() => {
    if (isLastDayToFirstDay) {
      setTimeout(() => {
        setPreviousDayIndex(0);
        setCurrentDayIndex(0);
      }, 300);
    }
  }, [isLastDayToFirstDay]);

  const formatAvailabilityData = useCallback(
    (availability: Availability): Schedule => {
      const scheduleObj: Schedule = {};

      Object.keys(availability).forEach((day) => {
        const dayNumber: number = dayMap[day.toLowerCase()];

        if (dayNumber) {
          const slotData: SlotData = availability[day];
          const timeSlots: string[] = slotData.slots;

          const formattedSlots: TimeSchedule[] = timeSlots.map((slot) => {
            const begin: string = slot.split(' - ')[0];
            const end: string = slot.split(' - ')[1];
            return { begin, end };
          });

          scheduleObj[dayNumber] = formattedSlots;
        }
      });

      return scheduleObj;
    },
    [dayMap]
  );

  function formatScheduleToAvailability(schedule: Schedule): Availability {
    const availability: Availability = {};

    const dayMap: { [key: number]: string } = {
      1: 'sunday',
      2: 'monday',
      3: 'tuesday',
      4: 'wednesday',
      5: 'thursday',
      6: 'friday',
      7: 'saturday'
    };

    Object.keys(schedule).forEach((dayNumber: string) => {
      const day: string = dayMap[parseInt(dayNumber)];
      const timeSlots: TimeSchedule[] = schedule[parseInt(dayNumber)];

      const formattedSlots: string[] = timeSlots.map((timeSlot) => {
        return `${timeSlot.begin} - ${timeSlot.end}`;
      });

      availability[day] = { timezone: '', slots: formattedSlots };
    });

    return availability;
  }
  function transformSchedule(inputData) {
    const transformedData = {};

    // Loop through the keys in the input data
    for (const key in inputData) {
      if (inputData[key]) {
        // Get the array of objects for the current key
        const timeRanges = inputData[key];

        // Initialize an array to store the transformed time ranges
        const transformedTimeRanges: any = [];

        // Loop through the time ranges for the current key
        timeRanges.forEach((timeRange) => {
          // Split the "begin" and "end" strings by ' → ' to separate the times
          const [begin, end] = timeRange.begin.split(' → ');

          // Push the transformed time range object into the array
          transformedTimeRanges.push({ begin, end });
        });

        // Add the transformed time ranges array to the transformedData object
        transformedData[key] = transformedTimeRanges;
      }
    }

    return transformedData;
  }

  useEffect(() => {
    if (Object.keys(schedule).length) {
      const availability = formatScheduleToAvailability(schedule);

      setTutorAvailability(availability);
    }
  }, [schedule]);

  useEffect(() => {
    if (Object.keys(availability).length && shouldFormatAvailability) {
      const schedule = formatAvailabilityData(availability);
      setShouldFormatAvailability(false);
      onboardTutorStore.set?.schedule(schedule);
    }
  }, [availability, shouldFormatAvailability, formatAvailabilityData]);

  const setAvailability = (
    f: (v: typeof availability) => typeof availability | typeof availability
  ) => {
    if (typeof f === 'function') {
      setTutorAvailability(f(availability));
    } else {
      setTutorAvailability(f);
    }
    setShouldFormatAvailability(true);
  };

  const currentDay = useMemo(() => {
    return Object.keys(availability)[currentDayIndex];
  }, [currentDayIndex, availability]);

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const handleSelectClick = () => {
    setShowCheckboxes(true);
  };

  const handleDayChange = (e: any) => {
    const { value, checked } = e.target;
    setAvailability((prevAvailability) => {
      if (checked) {
        if (!prevAvailability[value]) {
          prevAvailability[value] = { slots: [], timezone: '' } as SlotData;
        }
      } else {
        if (prevAvailability[value]) {
          delete prevAvailability[value];
        }
      }
      return { ...prevAvailability };
    });
  };

  // Function to check if all slots have a length greater than 0
  function allSlotsHaveLengthGreaterThanZero() {
    for (const key in schedule) {
      if (
        Object.keys(schedule) &&
        schedule[key] &&
        Array.isArray(schedule[key]) &&
        schedule[key].length === 0
      ) {
        return true; // Found an empty array value
      }
    }
    return false; // No empty array values found
  }

  return (
    <Box p={4}>
      <Stack spacing={5}>
        <FormControl>
          <FormLabel lineHeight="20px">
            What days will you be available{' '}
          </FormLabel>
          <CustomDropdown
            value={availabilityDays
              .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
              .join(',')}
            placeholder="Select days"
          >
            <VStack alignItems={'left'} padding="10px" width="100%">
              {daysOfWeek.map((day) => {
                return (
                  <Checkbox
                    isChecked={Object.keys(availability).includes(day.value)}
                    onChange={handleDayChange}
                    key={day.value}
                    value={day.value}
                  >
                    {day.label}
                  </Checkbox>
                );
              })}
            </VStack>
          </CustomDropdown>
        </FormControl>

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
            placeholder="Select a time zone"
            value={'Africa/Lagos'}
            onChange={(e) => onboardTutorStore.set.tz(e.target.value)}
          >
            {timezones.map((timezone) => (
              <option value={timezone.text}>{timezone.text}</option>
            ))}
          </CustomSelect>
        </FormControl>

        <FormControl marginTop={4}>
          <FormLabel lineHeight="20px" letterSpacing="-0.001em" color="#5C5F64">
            What time of the day will you be available{' '}
          </FormLabel>
          <CustomDropdown
            automaticClose={isLastDayToFirstDay}
            value={timezoneTextValue}
            disabled={Object.keys(availability).length < 1}
            useDefaultWidth
            placeholder="Select Time Slot"
          >
            <SelectTimeSlot
              day={currentDay}
              value={availability[currentDay]}
              onConfirm={(slots, timezone) => {
                setAvailability((prev) => {
                  if (prev[currentDay]) {
                    prev[currentDay] = { timezone, slots };
                  }
                  return { ...prev };
                });
                setPreviousDayIndex(currentDayIndex);
                setCurrentDayIndex(
                  currentDayIndex + 1 === Object.keys(availability).length
                    ? 0
                    : currentDayIndex + 1
                );
                updateSchedule(transformSchedule(schedule));
              }}
            />
          </CustomDropdown>
        </FormControl>
        {/* <Button
          isDisabled={
            !Object.keys(availability) || allSlotsHaveLengthGreaterThanZero()
          }
        >
          Update
        </Button> */}
      </Stack>
    </Box>
  );
};

export default AvailabilityEditForm;
