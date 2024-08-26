import { convertUtcToUserTime } from '../../../util';
import { Box, Button, Spacer, Flex, Text } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useNavigate } from 'react-router';
import flashcardStore from '../../../state/flashcardStore';

export default function HourReminder(props) {
  const { data, sessionPrefaceDialogRef } = props;
  const navigate = useNavigate();
  const { fetchSingleFlashcard } = flashcardStore();

  const getTextByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `Flashcard review scheduled`;
      case 'booking':
        return `Upcoming class starts`;

      default:
        return undefined;
    }
  };
  const getTagTextByEventType = (eventType, info) => {
    switch (eventType) {
      case 'study':
        return `${info} Practice`;
      case 'booking':
        return `${info} Lesson`;

      default:
        return undefined;
    }
  };
  const getTagTextColorByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `#fb9c3c`;
      case 'booking':
        return `#4CAF50`;

      default:
        return undefined;
    }
  };
  const getBgColorByEventType = (eventType) => {
    switch (eventType) {
      case 'study':
        return `#f0fdf4`;
      case 'booking':
        return `#FFF5F0`;

      default:
        return undefined;
    }
  };

  return (
    <>
      {' '}
      <Box
        bgColor={getBgColorByEventType(data?.data?.type)}
        py={2}
        px={7}
        pb={2}
        borderRadius={8}
        mb={4}
        textAlign="center"
      >
        <Flex alignItems={'center'}>
          <Box display="flex">
            <Text
              textTransform={'uppercase'}
              color={getTagTextColorByEventType(data?.data?.type)}
              fontSize={10}
              bgColor={data.data.type === ' study' ? '#F0FDF4' : '#FFF5F0'}
              borderRadius="3px"
              px={2}
              py={1}
              mr={10}
            >
              {getTagTextByEventType(
                data.data.type,
                data.data.type === 'study'
                  ? data.data.data?.entity?.deckname
                  : data.data.data?.offer.course.label
              )}
            </Text>
            <Text color="text.400" fontSize={14}>
              {getTextByEventType(data.data.type)}
            </Text>
            <Text fontSize={14} fontWeight={500} color="#F53535" ml={10}>
              {convertUtcToUserTime(data?.data?.data?.startDate)}
            </Text>
          </Box>

          <Spacer />
          <Box>
            {data.data.type === 'study' ? (
              <Button
                variant="unstyled"
                bgColor="#fff"
                color="#5C5F64"
                fontSize={12}
                px={2}
                py={0}
                onClick={() => fetchSingleFlashcard(data?.data?.data?.entityId)}
              >
                Practice
              </Button>
            ) : data.data.type === 'booking' ? (
              <Button
                variant="unstyled"
                bgColor="#fff"
                color="#5C5F64"
                fontSize={12}
                px={2}
                py={0}
                onClick={() =>
                  sessionPrefaceDialogRef.current?.open(
                    `${data.data.data.conferenceRoomUrl}`
                  )
                }
              >
                Join Lesson
              </Button>
            ) : null}
          </Box>
        </Flex>
        {/* <Flex
    alignItems={'center'}
    direction={{ base: 'column', md: 'row' }}
    justifyContent={{ base: 'center', md: 'space-between' }}
  >
    <Box
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems={{ base: 'center', md: 'flex-start' }}
      mb={{ base: 4, md: 0 }}
    >
      <Text
        textTransform={'uppercase'}
        color="#4CAF50"
        fontSize={{ base: 'sm', md: 'md' }}
        bgColor="rgba(191, 227, 193, 0.4)"
        borderRadius="3px"
        px={2}
        py={1}
        mr={{ base: 0, md: 10 }}
        mb={{ base: 2, md: 0 }}
        textAlign={{ base: 'center', md: 'left' }}
      >
        Chemistry Lesson
      </Text>
      <Text
        color="text.400"
        fontSize={{ base: 'sm', md: 'md' }}
        textAlign={{ base: 'center', md: 'left' }}
      >
        Upcoming class with Leslie Peters starts
      </Text>
      <Text
        fontSize={{ base: 'sm', md: 'md' }}
        fontWeight={500}
        color="#F53535"
        ml={{ base: 0, md: 10 }}
        mt={{ base: 2, md: 0 }}
        textAlign={{ base: 'center', md: 'left' }}
      >
        03:30 pm
      </Text>
    </Box>

    <Box>
      <Button
        variant="unstyled"
        bgColor="#fff"
        color="#5C5F64"
        fontSize={{ base: 'sm', md: 'md' }}
        px={2}
        py={0}
        onClick={() =>
          sessionPrefaceDialogRef.current?.open('http://google.com')
        }
      >
        Join Lesson
      </Button>
    </Box>
  </Flex> */}
      </Box>
    </>
  );
}
