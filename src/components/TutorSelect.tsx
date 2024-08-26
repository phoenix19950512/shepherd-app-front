import theme from '../theme';
import { Tutor } from '../types';
import SliderNavBtn from './SliderNavBtn';
import TutorCard from './TutorCard';
import { Box } from '@chakra-ui/react';
import { isEmpty } from 'lodash';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styled from 'styled-components';

const SliderNavParent = styled(Box)`
  position: absolute;
  top: calc(50% - 25px);
  transform: translateY(calc(-50% - 25px));
  left: 0;
  right: 0;
  opacity: 0;
  pointer-events: none;
  z-index: 3;
  transition: all 0.2s ease-out;
`;

const Slider = styled(Box)`
  padding: 8px;
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

const Item = styled(Box)`
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 50%;
  padding-inline: 8px;
  align-self: stretch;
`;

const StyledTutorCard = styled(TutorCard)<{ $active: boolean }>`
  cursor: pointer;
  box-shadow: ${(props) =>
    props._active ? `${theme.colors.primary[500]} 0px 0px 0px 2px` : 'none'};
  ${(props) =>
    props._active
      ? `
&:before {
    content: "";
    box-shadow: 0 0.125em 0.313em rgba(50, 50, 93, 0.09), 0 0.063em 0.125em rgba(0, 0, 0, 0.07);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
`
      : ''}
`;

const Root = styled(Box)`
  position: relative;

  &:hover {
    ${SliderNavParent} {
      opacity: 1;
      pointer-events: initial;
    }
  }

  @media (max-width: 768px) {
    ${Item} {
      width: 100%;
    }
  }
`;

type Props = {
  options: Tutor[];
  value: Tutor['_id'] | null;
  onChange: (value: Props['value']) => void;
};

export const TutorSelect: React.FC<Props> = ({
  onChange,
  options,
  value
}: Props) => {
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
        prevObserver.unobserve(items[0] as Element);
        nextObserver.unobserve(items[items.length - 1] as Element);
      }
    };
  }, [state]);

  const toggleValue = (v: Props['value']) => {
    onChange(v);
  };

  return (
    <Root ref={carouselRef}>
      <SliderNavParent>
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
      </SliderNavParent>
      <Slider className="scrollbar-hidden" ref={containerRef}>
        {options.map((o) => (
          <Item key={o._id}>
            <StyledTutorCard
              tutor={o}
              _active={o._id === value}
              onClick={() => toggleValue(o._id)}
            />
          </Item>
        ))}
      </Slider>
    </Root>
  );
};

export default TutorSelect;
