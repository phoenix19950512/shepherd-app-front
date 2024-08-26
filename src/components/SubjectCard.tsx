import React from 'react';
import { Box, Button, Divider, Flex, Spacer, Text } from '@chakra-ui/react';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { IoTrash } from 'react-icons/io5';
function SubjectCard({
  // key,
  title,
  subjectId,
  score,
  scoreColor,
  date,
  handleClick,
  handleDelete
}) {
  const navigate = useNavigate();

  const isTutor = window.location.pathname.includes(
    '/dashboard/tutordashboard'
  );

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      bg="white"
      onClick={handleClick}
      cursor="pointer"
    >
      <Box>
        <Flex>
          <Text fontSize="16px" fontWeight="500" p={4}>
            {title.length > 23 ? `${title.slice(0, 20)}...` : title}
          </Text>
          <Spacer />
          {!isTutor && (
            <Button
              float="right"
              size={'xs'}
              m={4}
              variant="outline"
              color={'#FC9B65'}
              borderColor={'#FC9B65'}
              _hover={{ bgColor: '#FEE1D0' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/dashboard/find-tutor?subjectId=${subjectId}`);
              }}
            >
              Find a Shepherd
            </Button>
          )}
        </Flex>

        <Divider mb={2} color="#EAEBEB" />
        <Box mb={2} border="1px solid #EAEBEB" borderRadius={6} p={2} m={4}>
          <Flex alignItems="center" fontSize="12px" fontWeight={500}>
            <Text mb={1}>Readiness Score</Text>
            <Spacer />
            <Text color="gray.700" fontSize="base" ml={2}>
              {Math.ceil(score)}%
            </Text>
          </Flex>{' '}
          <Box
            bg="gray.200"
            h="3"
            rounded="full"
            w="full"
            mb={2}
            overflow="hidden"
          >
            <Box
              bg={`${scoreColor}.500`}
              h="3"
              rounded="full"
              width={`${score}%`}
            ></Box>
          </Box>
        </Box>
        <Flex mx={4} my={2}>
          {' '}
          <Text color="#6E7682" fontSize="12px">
            Created {date}
          </Text>
          <Spacer />
          {/* <IoIosArrowDroprightCircle color="#ECEDEF" /> */}
          <IoTrash
            color="grey"
            onClick={(e) => {
              e.stopPropagation();
              // console.log(score);
              handleDelete();
            }}
          />
        </Flex>
      </Box>
    </Box>
  );
}
export default SubjectCard;
