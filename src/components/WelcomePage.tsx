import CloudDay from '../assets/day.svg';
import CloudNight from '../assets/night.svg';
import userStore from '../state/userStore';
import { numberToDayOfWeekName, twoDigitFormat } from '../util';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import moment from 'moment';
import React, { FC } from 'react';
import { RxDotFilled } from 'react-icons/rx';

interface WelcomePageProps {
  user: any;
}

const WelcomePage: FC<WelcomePageProps> = ({ user }) => {
  //Date
  const date = new Date();
  const weekday = numberToDayOfWeekName(date.getDay(), 'dddd');
  const month = moment().format('MMMM');
  const monthday = date.getDate();
  const time =
    twoDigitFormat(date.getHours()) + ':' + twoDigitFormat(date.getMinutes());
  const hours = date.getHours();
  const isDayTime = hours > 6 && hours < 20;

  return (
    // <section className="px-6 my-6">
    //   <Text className="sm:text-3xl text-2xl">{greeting}</Text>
    //   <div className="flex items-center space-x-2 text-gray-400">
    //     <img src="/svgs/cloud.svg" alt="" className="h-5 w-5" />
    //     <svg viewBox="0 0 2 2" className="h-2 w-2 fill-current">
    //       <circle cx={1} cy={1} r={1} />
    //     </svg>
    //     <Text>{date}</Text>
    //     <svg viewBox="0 0 2 2" className="h-2 w-2 text-gray-400 fill-current">
    //       <circle cx={1} cy={1} r={1} />
    //     </svg>
    //     <Text>{time}</Text>
    //   </div>
    // </section>
    <Box my={6} px={6}>
      <Text fontSize={24} fontWeight="bold" mb={1}>
        Hi {user?.name.first}, {isDayTime ? 'Good Morning!' : 'Good Evening!'}
      </Text>

      <Flex
        color="text.300"
        fontSize={14}
        fontWeight={400}
        alignItems="center"
        height="fit-content"
      >
        <Box>{isDayTime ? <CloudDay /> : <CloudNight />}</Box>
        <Box mt={1}>
          <RxDotFilled />
        </Box>
        <Text mb={0}>{`${weekday}, ${month} ${monthday}`}</Text>{' '}
        <Box mt={1}>
          <RxDotFilled />
        </Box>
        <Text mb={0}>{time}</Text>
      </Flex>
    </Box>
  );
};

export default WelcomePage;
