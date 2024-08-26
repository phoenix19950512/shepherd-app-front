import { Box, Flex, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import moment from 'moment';
import React, { useEffect, useState, useRef } from 'react';
import Slider from 'react-slick';

type CalendarProps = {
  year: number;
  month: number;
  onDayClick: (date: Date) => void;
};

const Calendar: React.FC<CalendarProps> = ({ year, month, onDayClick }) => {
  const sliderRef = useRef<Slider | null>(null);
  const [initialSlide, setInitialSlide] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(
    new Date().getDate()
  );
  const handleDayClick = (day: number) => {
    const selectedDate = new Date(year, month, day);
    setSelectedDay(day);

    onDayClick(selectedDate);
  };
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, index) => index + 1
  );
  const getDayOfWeek = (day: number) => {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay(); // Sunday: 0, Monday: 1, ...
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return dayNames[dayOfWeek];
  };
  const getMonthName = (month: number) => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return monthNames[month];
  };

  const PrevArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, color: '#9ca3af' }}
        onClick={onClick}
      >
        <ChevronLeftIcon className="arrow-icon " />
      </div>
    );
  };

  const NextArrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, color: '#9ca3af' }}
        onClick={onClick}
      >
        <ChevronRightIcon className="arrow-icon" />
      </div>
    );
  };

  const settings = {
    dots: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: selectedDay ? selectedDay - 1 : 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };

  const isMounted = useRef(false);

  useEffect(() => {
    // if (!isMounted.current) {
    //   isMounted.current = true;
    //   return;
    // }
    const currentMonth = moment().month();
    if (month !== currentMonth) {
      setSelectedDay(null);
    }
  }, [month]);

  return (
    <>
      <Text fontSize={12} fontWeight={500} ml={4} mt={1} color="#6E7682">
        {getMonthName(month)}
      </Text>

      <Box px={6}>
        {' '}
        <Slider {...settings}>
          {daysInMonth.map((day) => (
            <div
              className={`day ${
                selectedDay === day ? 'selected' : ''
              } text-gray-400 `}
              key={day}
              onClick={() => handleDayClick(day)}
            >
              <span className="block text-2xl font-normal ">{day}</span>
              <span className="date text-uppercase block text-sm font-normal">
                {getDayOfWeek(day)}
              </span>
            </div>
          ))}
        </Slider>
      </Box>
    </>
  );
};
export default Calendar;
