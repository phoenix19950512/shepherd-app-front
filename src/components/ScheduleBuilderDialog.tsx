import { SCHEDULE_FORMAT } from '../config';
import { SingleSchedule } from '../types';
import { numberToDayOfWeekName } from '../util';
import Select from './Select';
import TimePicker from './TimePicker';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { useRef, useState } from 'react';
import styled from 'styled-components';

export interface ScheduleBuilderDialogRef {
  buildSchedule: (dayOfWeek: number | null) => Promise<SingleSchedule>;
}

interface Props {
  children?: React.ReactNode;
}

const Root = styled(Box)``;

const dayOptions = [...new Array(7)].map((_, i) => {
  return { label: numberToDayOfWeekName(i), value: i };
});

const ScheduleBuilderDialog = React.forwardRef<ScheduleBuilderDialogRef, Props>(
  (props, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [days, setDays] = useState<Array<any>>([]);
    const promiseResolve = useRef<
      ((value: SingleSchedule | PromiseLike<SingleSchedule>) => void) | null
    >(null);
    const promiseReject = useRef<
      ((value: SingleSchedule | PromiseLike<SingleSchedule>) => void) | null
    >(null);

    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');

    const parseDateFormat = 'MM-DD-YYYY';

    React.useImperativeHandle(ref, () => {
      return {
        buildSchedule: async (dayOfWeek) => {
          onOpen();
          if (dayOfWeek !== null) {
            setDays([dayOptions.find((v) => v.value === dayOfWeek)]);
          }
          return new Promise<SingleSchedule>((resolve, reject) => {
            promiseResolve.current = resolve;
            promiseReject.current = resolve;
          });
        }
      };
    });

    const reset = () => {
      setFromTime('');
      setToTime('');
      setDays([]);
    };

    const done = () => {
      onClose();

      let resolveValue: SingleSchedule = {};
      days.forEach((d) => {
        resolveValue = {
          ...resolveValue,
          [d.value]: {
            begin: fromTime,
            end: toTime
          }
        };
      });

      promiseResolve.current?.(resolveValue);

      reset();
    };

    const dateStr = moment().format(parseDateFormat);

    const fromTimeDate = moment(
      `${dateStr}, ${fromTime}`,
      `${parseDateFormat}, ${SCHEDULE_FORMAT}`
    );
    const toTimeDate = moment(
      `${dateStr}, ${toTime}`,
      `${parseDateFormat}, ${SCHEDULE_FORMAT}`
    );

    const hoursDiff = moment.duration(toTimeDate.diff(fromTimeDate)).asHours();

    const canDone = !isEmpty(days) && !!fromTime && !!toTime && hoursDiff > 0;

    return (
      <Root>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            reset();
          }}
        >
          <ModalOverlay />
          <ModalContent overflow="visible">
            <ModalHeader>Add availability</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <Box>
                  <FormLabel>
                    <Box mb={2}>
                      Day of the week
                      <Box>
                        <Text variant={'muted'} mb={0}>
                          Select multiple days of the week to repeat
                          availability across them
                        </Text>
                      </Box>
                    </Box>
                    <Select
                      value={days}
                      isMulti
                      onChange={(v) => setDays(v as Array<any>)}
                      tagVariant="solid"
                      options={dayOptions}
                      size={'lg'}
                    />
                  </FormLabel>
                </Box>
                <Box>
                  <FormControl>
                    <FormLabel>
                      <Box>Time</Box>
                    </FormLabel>

                    <Box display={'flex'} alignItems="center" gap={'7px'}>
                      <TimePicker
                        inputGroupProps={{ size: 'lg' }}
                        inputProps={{
                          size: 'lg',
                          placeholder: '01:00 PM'
                        }}
                        value={fromTime}
                        onChange={(v: string) => {
                          setFromTime(v);
                        }}
                      />
                      <Text as="small">to</Text>
                      <TimePicker
                        inputGroupProps={{ size: 'lg' }}
                        inputProps={{
                          placeholder: '06:00 PM'
                        }}
                        value={toTime}
                        onChange={(v: string) => {
                          setToTime(v);
                        }}
                      />
                    </Box>
                  </FormControl>
                </Box>
                {hoursDiff < 0 && !!fromTime && !!toTime && (
                  <Alert
                    alignItems={'center'}
                    gap={'5px'}
                    status="error"
                    mt={3}
                  >
                    <AlertIcon />
                    <AlertDescription>
                      The start time should be before the end time.
                    </AlertDescription>
                  </Alert>
                )}
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button isDisabled={!canDone} onClick={done}>
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Root>
    );
  }
);

export default ScheduleBuilderDialog;
