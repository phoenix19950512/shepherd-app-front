import { SCHEDULE_FORMAT } from '../config';
import theme from '../theme';
import { Slot } from '../types';
import SliderNavBtn from './SliderNavBtn';
import { Box, Checkbox, Text } from '@chakra-ui/react';
import { find, isEmpty, xorBy } from 'lodash';
import moment, { Moment } from 'moment-timezone';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

const DateRow = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: ${theme.radii.md};
  overflow: hidden;
`;

const DateRowDates = styled(Box)`
  overflow: hidden;
  white-space: nowrap;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  width: 100%;
  margin: 0px auto;
  display: flex;
  height: 100%;
  align-items: center;
`;

const DateCol = styled(Box)`
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  scroll-snap-align: end;
  flex-shrink: 0;
  width: calc(33.33% + 1px);
  scroll-margin-right: -1px;
  scroll-margin-left: 1px;

  small {
    font-weight: 500;
    color: #575757;
  }
`;

const DateColHeader = styled(Box)`
  width: 100%;
  height: 75px;
  text-align: center;
  padding-block: 16px;
  border-bottom: 1px solid ${theme.colors.gray[200]};
  border-right: 1px solid ${theme.colors.gray[200]};
  display: flex;
  gap: 3px;
  justify-content: center;
  flex-direction: column;
  background: ${theme.colors.gray[50]};
  overflow: hidden;
`;

const SlotButton = styled('button')<{ $active: boolean }>`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: #edf2f7;
  width: 100%;
  height: 40px;
  border: 2px solid transparent;
  margin-bottom: 10px;
  font-size: 13px;
  color: #424347;
  font-weight: 500;
  transition: all 0.2s ease-out;

  ${(props) =>
    props.$active
      ? `
border-color: ${theme.colors.primary[500]};
background: #FFF;
`
      : ''};
`;

const DateColContent = styled(Box)`
  width: 100%;
  height: 400px;
  padding: 10px;
  position: relative;
  overflow: scroll;

  &:after {
    content: '';
    position: absolute;
    background: ${theme.colors.gray[200]};
    right: 0px;
    width: 1px;
    top: 0;
    bottom: 0;
  }
`;

const Root = styled(Box)`
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.radii.md};
  overflow: hidden;

  @media (max-width: 992px) {
    ${DateCol} {
      width: calc(50% + 1px);
    }
  }

  @media (max-width: 768px) {
    ${DateCol} {
      width: calc(100% + 1px);
    }
  }
`;

type Props = {
  value: Slot[];
  onChange: (value: Props['value']) => void;
  schedule: {
    date: Moment;
    slots: Slot[];
  }[];
};

const Scheduler: React.FC<Props> = ({ value, onChange, schedule }) => {
  const containerRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLElement>(null);

  const [state, setState] = useState<{
    scroller: any;
    itemWidth: number;
    isPrevHidden: boolean;
    isNextHidden: boolean;
  }>({
    scroller: null,
    itemWidth: 0,
    isPrevHidden: false,
    isNextHidden: false
  });

  const next = () => {
    state.scroller?.scrollBy({
      left: state.itemWidth * 1,
      top: 0,
      behavior: 'smooth'
    });
  };

  const prev = () => {
    state.scroller.scrollBy({
      left: -state.itemWidth * 1,
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.9
    };

    const prevObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.9) {
          setState((existingState) => {
            return { ...existingState, isPrevHidden: true };
          });
        } else {
          setState((existingState) => {
            return { ...existingState, isPrevHidden: false };
          });
        }
      });
    }, options);

    const nextObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio >= 0.9) {
          setState((existingState) => {
            return { ...existingState, isNextHidden: true };
          });
        } else {
          setState((existingState) => {
            return { ...existingState, isNextHidden: false };
          });
        }
      });
    }, options);

    const items = containerRef.current?.childNodes;
    const scroller = containerRef.current;
    const itemWidth = containerRef.current?.firstElementChild?.clientWidth || 0;

    setState({ ...state, scroller, itemWidth });

    if (!!items && !isEmpty(items)) {
      prevObserver.observe(items[0] as Element);
      nextObserver.observe(items[items.length - 1] as Element);
    }

    return () => {
      if (!!items && !isEmpty(items)) {
        prevObserver.observe(items[0] as Element);
        nextObserver.unobserve(items[items.length - 1] as Element);
      }
    };
  }, [state]);

  const toggleArrayValue = (v: Slot) => {
    onChange(xorBy(value, [v], 'begin'));
  };

  return (
    <Root>
      <DateRow ref={carouselRef}>
        {!state.isPrevHidden && (
          <SliderNavBtn onClick={(e) => prev()} className="left">
            <FiChevronLeft />
          </SliderNavBtn>
        )}
        {!state.isNextHidden && (
          <SliderNavBtn onClick={(e) => next()} className="right">
            <FiChevronRight />
          </SliderNavBtn>
        )}
        <DateRowDates className="scrollbar-hidden" ref={containerRef}>
          {schedule.map((d) => {
            const formattedDate = d.date.format('MMM D');

            return (
              <DateCol key={formattedDate}>
                <DateColHeader>
                  <Text
                    fontWeight={500}
                    variant={'muted'}
                    textTransform={'uppercase'}
                    fontSize={'small'}
                  >
                    {d.date.format('ddd')}
                  </Text>
                  <Text fontSize={'md'}>{formattedDate}</Text>
                </DateColHeader>
                <DateColContent>
                  {!isEmpty(d.slots) ? (
                    d.slots.map((slot) => {
                      const active = !!find(value, slot);
                      return (
                        <SlotButton
                          key={slot.begin}
                          $active={active}
                          onClick={() => toggleArrayValue(slot)}
                        >
                          <Checkbox
                            pointerEvents={'none'}
                            size="lg"
                            isChecked={active}
                            variant={'looney'}
                          />
                          <Box display={'flex'} alignItems="center">
                            <Text>
                              {moment(slot.begin).format(SCHEDULE_FORMAT)}
                            </Text>{' '}
                            <FiChevronRight
                              style={{
                                fontSize: '16px',
                                marginInline: '7px'
                              }}
                            />{' '}
                            <Text>
                              {moment(slot.end).format(SCHEDULE_FORMAT)}
                            </Text>
                          </Box>
                        </SlotButton>
                      );
                    })
                  ) : (
                    <Box
                      width={'100%'}
                      height={'100%'}
                      display="flex"
                      flexDirection={'column'}
                      justifyContent={'center'}
                      alignItems="center"
                    >
                      <img
                        alt="no availability"
                        style={{ height: '80px' }}
                        src="/images/empty-state-schedule.png"
                      />
                      <Box mt={2}>
                        <Text
                          whiteSpace={'normal'}
                          as="small"
                          variant={'muted'}
                        >
                          There are no open slots on this day
                        </Text>
                      </Box>
                    </Box>
                  )}
                </DateColContent>
              </DateCol>
            );
          })}
        </DateRowDates>
      </DateRow>
    </Root>
  );
};

export default Scheduler;
