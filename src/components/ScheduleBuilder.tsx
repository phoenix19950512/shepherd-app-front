import theme from '../theme';
import { Schedule, SingleSchedule } from '../types';
import { numberToDayOfWeekName } from '../util';
import EmptyState from './EmptyState';
import ScheduleBuilderDialog, {
  ScheduleBuilderDialogRef
} from './ScheduleBuilderDialog';
import {
  Box,
  Button,
  Heading,
  IconButton,
  Input,
  Text
} from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useRef } from 'react';
import { FiAlertTriangle, FiPlus, FiTrash } from 'react-icons/fi';
import styled from 'styled-components';

/* eslint-disable */
export interface ScheduleBuilderRef {} //but why?

interface Props {
  value: Schedule;
  onChange: (v: Props['value']) => void;
}

const Root = styled(Box)``;

const ScheduleBuilder = React.forwardRef<ScheduleBuilderRef, Props>(
  ({ onChange, value }, ref) => {
    const scheduleBuilderDialogRef = useRef<ScheduleBuilderDialogRef>(null);

    const addTime = async (d: number | null) => {
      const schedule = (await scheduleBuilderDialogRef.current?.buildSchedule(
        d
      )) as SingleSchedule;
      const v = { ...value };

      Object.keys(schedule).forEach((d: any) => {
        if (!v[d]) {
          v[d] = [
            {
              begin: schedule[d].begin,
              end: schedule[d].end
            }
          ];
        } else {
          v[d].push({
            begin: schedule[d].begin,
            end: schedule[d].end
          });
        }
      });

      onChange(v);
    };

    const deleteTime = (i: number, d: number) => {
      const nv = JSON.parse(JSON.stringify(value));
      nv[d].splice(i, 1);
      if (!nv[d] || nv[d].length === 0) {
        delete nv[d];
      }
      onChange(nv);
    };

    const daysInValue = Object.keys(value).map((v) => parseInt(v));

    return (
      <Root>
        <ScheduleBuilderDialog ref={scheduleBuilderDialogRef} />
        <Box
          display="flex"
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Heading as="h3">Availability</Heading>
          <Box>
            {!isEmpty(value) && (
              <Button
                size={'sm'}
                onClick={() => addTime(null)}
                leftIcon={<FiPlus />}
                colorScheme="primary"
                variant={'solid'}
              >
                Add Availability
              </Button>
            )}
          </Box>
        </Box>
        {daysInValue.length > 0 ? (
          daysInValue.map((d, _) => {
            const dayOfWeekName = numberToDayOfWeekName(d);
            const timesInDay = value[d];

            return (
              <Box key={d} marginBottom={10}>
                <Text className="body2" mb={0}>
                  {dayOfWeekName}
                </Text>
                <Box marginTop={1}>
                  {timesInDay.length === 0 ? (
                    <Box display={'flex'} gap={'15px'} alignItems="center">
                      <Box
                        width={'40px'}
                        height={'40px'}
                        background={theme.colors.primary[50]}
                        display="flex"
                        alignItems={'center'}
                        justifyContent="center"
                        borderRadius={'100%'}
                      >
                        <FiAlertTriangle color={theme.colors.primary[700]} />
                      </Box>
                      <Box>
                        <Text as="b">No times added</Text>
                        <Text as="small" display={'block'}>
                          Looks like you haven't indicated availability for{' '}
                          {dayOfWeekName}.
                        </Text>
                        <Box marginTop={1}>
                          <Button
                            onClick={() => addTime(d)}
                            leftIcon={<FiPlus />}
                            size="xs"
                            colorScheme="primary"
                            variant={'solid'}
                          >
                            Add Time
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      {timesInDay.map((t, i) => {
                        return (
                          <Box key={i} marginBottom={2}>
                            <Box
                              display={'flex'}
                              alignItems="center"
                              gap={'7px'}
                            >
                              <Input
                                size={'lg'}
                                readOnly
                                type="text"
                                value={`${t.begin}`}
                              />
                              <Text as="small">to</Text>
                              <Input
                                size={'lg'}
                                readOnly
                                type="text"
                                value={`${t.end}`}
                              />
                              <IconButton
                                variant={'ghost'}
                                onClick={() => deleteTime(i, d)}
                                aria-label="Delete"
                                icon={<FiTrash />}
                              />
                            </Box>
                          </Box>
                        );
                      })}
                      <Box>
                        <Button
                          onClick={() => addTime(d)}
                          leftIcon={<FiPlus />}
                          size="xs"
                          colorScheme="primary"
                          variant={'solid'}
                        >
                          Add Another Time For {dayOfWeekName}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            );
          })
        ) : (
          <EmptyState
            title="No availability added"
            subtitle={
              "Looks like you haven't indicated your availability yet, hit the button below to get started."
            }
            action={
              <Button
                onClick={() => addTime(null)}
                leftIcon={<FiPlus />}
                colorScheme="primary"
                variant={'solid'}
              >
                Add Availability
              </Button>
            }
            image={
              <img
                alt="no availability"
                style={{ height: '80px' }}
                src="/images/empty-state-schedule.png"
              />
            }
          />
        )}
      </Root>
    );
  }
);

export default ScheduleBuilder;
