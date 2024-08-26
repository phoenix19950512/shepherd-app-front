import { convertTimeToTimeZone, convertTimeToDateTime } from '../util';
import {
  PencilIcon,
  SparklesIcon,
  ArrowRightIcon,
  EllipsistIcon
} from './icons';
import { StarIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Divider,
  Image,
  Text,
  Flex,
  HStack,
  VStack,
  GridItem
} from '@chakra-ui/react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import React from 'react';

function StudentCard(props) {
  const navigate = useNavigate();
  const { id, imageURL, name, offer, time } = props;

  function Updated() {
    return (
      <Text
        as="p"
        display="inline-flex"
        flexShrink={0}
        alignItems="center"
        rounded="md"
        py="1"
        px="1.5"
        bg="blue.50"
        fontSize="xs"
        mr="2"
        fontWeight="medium"
        color="blue.500"
        className="space-x-1"
      >
        <PencilIcon className="w-4 h-4" onClick={undefined} />
        <Text as="span">Updated</Text>
      </Text>
    );
  }

  function PerfectOffer() {
    return (
      <Text className="inline-flex flex-shrink-0 mr-2 space-x-1 items-center rounded-md bg-blue-100 px-1.5 py-1 text-xs font-medium text-secondaryBlue">
        <StarIcon w={4} h={4} />
        <span>Perfect Offer</span>
      </Text>
    );
  }

  function New() {
    return (
      <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
        <SparklesIcon className="w-4 h-4" onClick={undefined} />
        <span>New</span>
      </Text>
    );
  }

  function Date(date) {
    return (
      <Text className="inline-flex flex-shrink-0 space-x-1 items-center rounded-md bg-gray-100 px-1.5 py-1 text-xs font-medium text-secondaryGray">
        {moment(date).format('MM.DD.YYYY')}
      </Text>
    );
  }

  function getBeginTime(schedule) {
    for (let day = 0; day <= 7; day++) {
      const firstKey = Object.keys(schedule)[0];
      const beginValue = schedule[firstKey]?.begin;

      return beginValue;
    }
  }
  function getEndTime(schedule) {
    for (let day = 0; day <= 7; day++) {
      const firstKey = Object.keys(schedule)[0];
      const endValue = schedule[firstKey]?.end;

      return endValue;
    }
  }
  const handleItemClick = () => {
    navigate(`/dashboard/tutordashboard/offer/${offer.id}`);
  };

  const styles = {
    boxShadow: '0px 4px 20px 0px #737E8C26'
  };
  return (
    <>
      <GridItem
        onClick={handleItemClick}
        mb={6}
        cursor="pointer"
        border="1px"
        borderColor="gray.100"
        p={3}
        rounded="lg"
        bg="white"
        sx={styles}
        gap={2}
        colSpan={1}
      >
        {' '}
        <Box>
          <VStack spacing={3} alignItems="left">
            <Flex w="full" justifyContent="space-between" alignItems="center">
              <Box flexShrink={0} bg="gray.100" p={2} rounded="full">
                <Image
                  src="/svgs/text-document.svg"
                  color="gray.400"
                  h={6}
                  w={6}
                  alt=""
                />
              </Box>

              <Box>
                {/* <Flex align="center">
                  {status.perfectOffer === 1 && <PerfectOffer />}
                  {status.updated === 1 && <Updated />}
                  {status.new === 1 && <New />}
                  {status.justDate === 1 && <Date />}
                </Flex> */}
                {Date(offer.expirationDate)}
              </Box>
            </Flex>

            <Flex w="full" alignItems="center" justifyContent="space-between">
              <Flex gap={1} alignItems="center">
                <Text fontSize={16} fontWeight="500">
                  {offer?.course?.label}
                </Text>
                <Text
                  as="p"
                  display="inline-flex"
                  align="center"
                  rounded="md"
                  bg="#FFF2EB"
                  px={'6px'}
                  py={'2px'}
                  fontSize="xs"
                  fontWeight="medium"
                  color="#FB8441"
                >
                  <Text as="span">{offer?.level?.label}-Level</Text>
                </Text>
              </Flex>

              <Text as="p" fontSize="md" fontWeight="medium">
                ${offer.amount}/hr
              </Text>
            </Flex>

            <Flex
              as="p"
              color="gray.500"
              fontSize="sm"
              fontWeight="normal"
              alignItems="center"
              gap={1}
            >
              <Text as="span">
                {offer.schedule && Object.keys(offer.schedule).length} lesson
                weekly
              </Text>
              <EllipsistIcon className="w-1 mx-0.5" onClick={undefined} />
              <Text as="span">
                {/* {convertTimeToTimeZone(
                  convertTimeToDateTime(getBeginTime(offer.schedule)),
                  offer.scheduleTz
                )} */}
              </Text>
              <ArrowRightIcon className="w-3 mx-0.5" onClick={undefined} />
              <Text as="span">
                {/* {convertTimeToTimeZone(
                  convertTimeToDateTime(getEndTime(offer.schedule)),
                  offer.scheduleTz
                )} */}
              </Text>
            </Flex>
          </VStack>
          <Divider my={2} color="gray.400" />
          <Flex alignItems="center" justifyContent="space-between" pt="1">
            <Flex alignItems="center" fontSize="sm" fontWeight="normal" gap={3}>
              <Avatar
                name={`${offer.student.user.name.first} ${offer.student.user.name.last}`}
                size="sm"
                src={offer.student.user.avatar}
              />
              <Text fontSize={14} fontWeight="500" color="text.300">
                {`${offer.student.user.name.first} ${offer.student.user.name.last}`}
              </Text>
            </Flex>
            <Text as="p" fontSize="sm" fontWeight="semibold" color="red.400">
              {time ? `${time}hours left` : ''}
            </Text>
          </Flex>
        </Box>
      </GridItem>
    </>
  );
}

export default StudentCard;
