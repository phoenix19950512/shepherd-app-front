import { Text, Grid, Box, Flex, Image } from '@chakra-ui/react';
import React from 'react';

export default function GridList(props) {
  const { data } = props;

  return (
    <Grid
      templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }}
      gap="4"
      mt="4"
      px="6"
    >
      <Box
        pos="relative"
        display="flex"
        alignItems="center"
        overflow="hidden"
        rounded="lg"
        border="1px"
        borderColor="gray.200"
        px="4"
        pb="4"
        pt="8"
        bg="#207df7"
        shadow="sm"
        _focusWithin={{
          ring: '2',
          ringColor: 'indigo.500',
          ringOffset: '2'
        }}
        _hover={{
          border: '1px',
          borderColor: 'gray.400'
        }}
      >
        <Box
          pos="absolute"
          right="-4"
          top="4"
          transform="rotate(-10deg)"
          color="gray.400"
          overflow="auto"
        >
          <Image width={150} height={150} src="/svgs/card-money.svg" alt="" />
        </Box>
        <Flex direction="column" minW="0" flex="1">
          <Text as="span" pos="absolute" inset="0" aria-hidden="true" />
          <Text as="p" fontSize="sm" fontWeight="medium" color="whiteAlpha.900">
            Total earned
          </Text>
          <Text
            as="p"
            my={0.5}
            fontSize="2xl"
            fontWeight="semibold"
            color="white"
          >
            {` $${data.totalAmountEarned}`}
          </Text>
          {/* <Text as="p" fontSize="sm" color="whiteAlpha.900" isTruncated>
            24hrs of tutoring completed!
          </Text> */}
        </Flex>
      </Box>
      <Box
        position="relative"
        display="flex"
        alignItems="center"
        rounded="lg"
        border="1px"
        borderColor="gray.200"
        bg="gray.50"
        overflow="hidden"
        px="4"
        py="2"
        boxShadow="sm"
        _focusWithin={{
          ring: '2',
          ringColor: 'indigo.500',
          ringOffset: '2'
        }}
        _hover={{
          border: '1px',
          borderColor: 'gray.400'
        }}
      >
        <Box
          position="absolute"
          right="-4"
          top="2"
          transform="rotate(-24deg)"
          color="gray.400"
        >
          <Image width={150} height={150} src="/svgs/card-case.svg" alt="" />
        </Box>
        <Flex direction="column" minW="0" flex="1">
          <Box position="absolute" inset="0" aria-hidden="true" />
          <Text fontSize="sm" fontWeight="medium" color="gray.400">
            Total Students
          </Text>
          <Text fontSize="2xl" my={0.5} fontWeight="semibold">
            {data.completedClientsCount}
          </Text>
          {/* <Text fontSize="sm" color="green.400" isTruncated>
            + Increased 10% this month
          </Text> */}
        </Flex>
      </Box>

      <Box
        position="relative"
        overflow="hidden"
        display="flex"
        alignItems="center"
        rounded="lg"
        border="1px"
        borderColor="gray.200"
        bg="gray.50"
        px="4"
        py="2"
        boxShadow="sm"
        _focusWithin={{
          ring: '2',
          ringColor: 'indigo.500',
          ringOffset: '2'
        }}
        _hover={{
          border: '1px',
          borderColor: 'gray.400'
        }}
      >
        <Box
          position="absolute"
          right="-4"
          top="2"
          transform="rotate(-24deg)"
          color="gray.400"
          overflow="auto"
        >
          <Image width={150} height={150} src="/svgs/card-groups.svg" alt="" />
        </Box>
        <Flex direction="column" minW="0" flex="1">
          <Box position="absolute" inset="0" aria-hidden="true" />
          <Text fontSize="sm" fontWeight="medium" color="gray.400">
            Current clients
          </Text>
          <Text fontSize="2xl" my={0.5} fontWeight="semibold">
            0
          </Text>
          {/* <Text fontSize="sm" color="red.400" isTruncated>
            - Decreased 10% this month
          </Text> */}
        </Flex>
      </Box>
    </Grid>
  );
}
