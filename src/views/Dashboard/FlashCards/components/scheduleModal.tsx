import CalendarDateInput from '../../../../components/CalendarDateInput';
import CustomSelect from '../../../../components/CustomSelect';
import DatePicker from '../../../../components/DatePicker';
import Select, { Option } from '../../../../components/Select';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react';
import { format } from 'date-fns';
import React, { useState, ChangeEvent, useMemo } from 'react';

export interface ScheduleFormState {
  day: Date | null;
  time: string;
  endDate?: Date | null;
  frequency?: string;
}

interface ScheduleStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSumbit: (d: ScheduleFormState) => void;
}

export const ScheduleStudyModal: React.FC<ScheduleStudyModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onSumbit
}) => {
  const today = useMemo(() => new Date(), []);
  const [formState, setScheduleFormState] = useState<ScheduleFormState>({
    day: null,
    time: ''
    // frequency: '',
    // endDate: null
  });

  const isValid = useMemo(() => {
    return [formState.day, formState.time].every(Boolean);
  }, [formState]);

  const timeOptions = Array.from({ length: 96 }, (_, index) => {
    const hour = Math.floor(index / 4);
    const minute = 15 * (index % 4);
    const displayHour = hour === 0 || hour === 12 ? 12 : hour % 12;
    const displayMinute = minute === 0 ? '00' : String(minute);
    const period = hour < 12 ? ' AM' : ' PM';

    const time = `${displayHour}:${displayMinute}${period}`;

    return { label: time, value: time };
  });

  const handleInputChange =
    (name: keyof ScheduleFormState) => (value: string | Date | null) => {
      setScheduleFormState((prevState) => ({ ...prevState, [name]: value }));
    };

  const frequencyOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: "Doesn't Repeat", value: 'none' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Study</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={'auto'}>
          <Box width="100%" paddingBottom={'50px'}>
            <FormControl id="day" marginBottom="20px">
              <FormLabel>Day</FormLabel>
              <CalendarDateInput
                disabledDate={{ before: today }}
                inputProps={{
                  placeholder: 'Select Day'
                }}
                value={formState.day as Date}
                onChange={handleInputChange('day')}
              />
            </FormControl>

            <FormControl id="time" marginBottom="20px">
              <FormLabel>Time</FormLabel>
              <Select
                defaultValue={timeOptions.find(
                  (option) => option.value === formState.time
                )}
                tagVariant="solid"
                placeholder="Select Time"
                options={timeOptions}
                size={'md'}
                onChange={(option) =>
                  handleInputChange('time')((option as Option).value)
                }
              />
            </FormControl>
          </Box>
        </ModalBody>

        <ModalFooter
          bg="#F7F7F8"
          borderRadius="0px 0px 10px 10px"
          p="16px"
          justifyContent="flex-end"
        >
          <Button
            isDisabled={!isValid}
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
            onClick={() => onSumbit(formState)}
            isLoading={isLoading}
            borderRadius="8px"
            boxShadow="0px 2px 6px 0px rgba(136, 139, 143, 0.10)"
            mr={3}
            variant="primary"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ScheduleStudyModal;
