import { SCHEDULE_FORMAT } from '../config';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FiClock } from 'react-icons/fi';

interface TimePickerProps {
  value: string;
  smTime?: boolean;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  inputProps?: React.ComponentProps<typeof Input>;
  inputGroupProps?: React.ComponentProps<typeof InputGroup>;
}

export const FORMAT = SCHEDULE_FORMAT;

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  smTime,
  isDisabled,
  inputProps = {},
  inputGroupProps = {}
}) => {
  const [hours, setHours] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [isPm, setIsPm] = useState<boolean>(false);

  const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 12) {
      setHours(value.toString().padStart(2, '0'));

      onChange(
        `${value.toString().padStart(2, '0')}:${(minutes || '00').padStart(
          2,
          '0'
        )} ${isPm ? 'PM' : 'AM'}`
      );
    }
  };

  const handleMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 59) {
      setMinutes(value.toString().padStart(2, '0'));
      onChange(
        `${hours.padStart(2, '0')}:${value.toString().padStart(2, '0')} ${
          isPm ? 'PM' : 'AM'
        }`
      );
    }
  };

  const handleToggleAmPm = () => {
    setIsPm(!isPm);
    onChange(
      `${hours.padStart(2, '0')}:${(minutes || '00').padStart(2, '0')} ${
        !isPm ? 'PM' : 'AM'
      }`
    );
  };

  return (
    <Box>
      <Popover>
        <PopoverTrigger>
          {smTime ? (
            <Box w={'85px'} p={0}>
              <InputGroup {...inputGroupProps}>
                {/* <InputRightElement children={<FiClock />} /> */}
                <Input
                  fontSize={'11px'}
                  value={value}
                  h={'15px'}
                  {...inputProps}
                  readOnly
                />
              </InputGroup>
            </Box>
          ) : (
            <InputGroup {...inputGroupProps}>
              <InputRightElement children={<FiClock />} />
              <Input value={value} {...inputProps} readOnly />
            </InputGroup>
          )}
        </PopoverTrigger>
        {!isDisabled && (
          <PopoverContent width={'auto'} p={2}>
            <PopoverArrow />
            <Flex alignItems="center" justifyContent="space-between">
              <Flex alignItems="center">
                <Input
                  value={hours}
                  onChange={handleHoursChange}
                  type="number"
                  min="0"
                  max="12"
                  placeholder="HH"
                  mr={2}
                />
                <Input
                  value={minutes}
                  onChange={handleMinutesChange}
                  type="number"
                  min="0"
                  max="59"
                  placeholder="MM"
                  mr={2}
                />
                <Button size="sm" onClick={handleToggleAmPm}>
                  {isPm ? 'PM' : 'AM'}
                </Button>
              </Flex>
            </Flex>
          </PopoverContent>
        )}
      </Popover>
    </Box>
  );
};

export default TimePicker;
