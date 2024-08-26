import { PencilIcon, ArrowRightIcon } from '../icons';
import {
  Flex,
  Box,
  Badge,
  Text,
  Stack,
  Image,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider
} from '@chakra-ui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Subject {
  id: number;
  subject: string;
  level: string;
  price: string;
}

const subject: Subject[] = [
  { id: 0, subject: 'Economics', level: 'GSCE', price: '10.00' },
  { id: 1, subject: 'Mathematics', level: 'A-Level', price: '10.00' },
  { id: 2, subject: 'Yoruba', level: 'Grade 12', price: '10.00' }
];

export default function ProfileTab() {
  return (
    <div className="space-y-6">
      <section className="divide-y space-y-4 ring-1 ring-gray-900/5 shadow-sm sm:rounded-lg p-4">
        <Flex>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={{ base: 3, sm: 0 }}
            alignItems="center"
            display="flex"
            pos="relative"
          >
            <Badge
              h="16"
              w="16"
              display="flex"
              fontWeight="bold"
              border="1px"
              mr="4"
              fontSize="xl"
              borderColor="white"
              rounded="full"
              justifyContent="center"
              alignItems="center"
              color="white"
              bg="green.400"
            >
              L
            </Badge>
            <Badge
              pos="absolute"
              top="10"
              left="12"
              bg="blue.500"
              display="flex"
              justifyContent="center"
              alignItems="center"
              rounded="full"
              w="5"
              h="5"
            >
              <PencilIcon className="w-3 text-white" onClick={undefined} />
            </Badge>
            <Text as="p">
              <Text as="span" display="block" whiteSpace="nowrap">
                Leslie Peters
              </Text>
              <Text
                as="span"
                display="inline-block"
                color="gray.400"
                fontSize="sm"
              >
                lesliepeters@gmail.com
              </Text>
            </Text>
          </Stack>
        </Flex>
        <Text as="p" display="flex" alignItems="center" fontSize="md" pt="4">
          <Text
            as="span"
            textTransform="uppercase"
            fontSize="xs"
            color="gray.500"
            mr="6"
          >
            Hourly rate
          </Text>
          <Text as="span" fontWeight="bold" fontSize="lg">
            $20.00/hr
          </Text>
        </Text>
      </section>

      <Box
        pos="relative"
        rounded="lg"
        overflow="hidden"
        bg="gray.900"
        isolation="isolate"
        px={{ base: 6, lg: 8 }}
        py={{ base: 24, sm: 32 }}
      >
        <Image
          src="/images/profile.png"
          alt=""
          pos="absolute"
          inset={0}
          zIndex={-10}
          h="full"
          w="full"
          objectFit="cover"
        />
        <Box pos="absolute" inset={0} opacity="0.8" bg="#0D1926"></Box>
        <Box pos="relative" zIndex={10} mx="auto" maxW="2xl" textAlign="center">
          <Heading
            as="h2"
            fontSize={['4xl', 'xl']}
            fontWeight="bold"
            color="white"
          >
            Update intro video
          </Heading>
        </Box>
      </Box>

      <Box border="1px" shadow="sm" rounded="lg" borderColor="gray.200" p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text as="p" color="gray.600">
            About Me
          </Text>
          <Box
            bg="white"
            border="1px"
            borderColor="gray.200"
            display="flex"
            justifyContent="center"
            alignItems="center"
            rounded="full"
            w={8}
            h={8}
          >
            <PencilIcon
              className="w-4 text-secondaryGray"
              onClick={undefined}
            />
          </Box>
        </Flex>
        <Text
          as="p"
          fontSize="sm"
          mt={4}
          fontWeight="normal"
          textAlign="justify"
        >
          Quam eros suspendisse a pulvinar sagittis mauris. Vel duis adipiscing
          id faucibus consectetur amet. Tempor dui quam scelerisque at tempor
          aliquam. Vivamus aenean hendrerit turpis velit pretium consectetur
          quam ut malesuada. Tempor dui quam scelerisque at tempor aliquam.
          Vivamus aenean hendrerit turpis velit pretium consectetur quam ut
          malesuada.
        </Text>
      </Box>

      <Box border="1px" borderColor="gray.200" shadow="sm" rounded="lg" p={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text as="p" color="gray.500">
            Subject Offered
          </Text>
          <Flex
            bg="white"
            justifyContent="center"
            alignItems="center"
            border="1px"
            rounded="full"
            borderColor="gray.200"
            w={8}
            h={8}
          >
            <PencilIcon
              className="w-4 text-secondaryGray"
              onClick={undefined}
            />
          </Flex>
        </Flex>

        <Table minW="full" borderWidth="1px" borderColor="gray.300">
          <Thead>
            <Tr border="1px" borderColor="gray.200">
              <Th
                scope="col"
                py={3.5}
                pr={4}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                bg="gray.50"
                pl={{ base: 0, sm: 4 }}
              ></Th>
              <Th
                scope="col"
                py={3.5}
                pr={4}
                textAlign="left"
                fontSize="sm"
                fontWeight="semibold"
                border="1px"
                color="gray.700"
                borderColor="gray.200"
                pl={{ base: 0, sm: 4 }}
              >
                Level
              </Th>
              <Th
                scope="col"
                py={3.5}
                pr={4}
                textAlign="left"
                fontSize="sm"
                color="gray.700"
                fontWeight="semibold"
                pl={{ base: 0, sm: 4 }}
              >
                Price
              </Th>
            </Tr>
          </Thead>
          <Tbody className="divide-y divide-gray-200 bg-white">
            {subject.map(({ subject, level, price, id }) => (
              <Tr key={id}>
                <Td
                  whiteSpace="nowrap"
                  py={4}
                  pl={4}
                  pr={4}
                  border="1px"
                  borderColor="gray.200"
                  fontSize="sm"
                  fontWeight="medium"
                  bg="gray.50"
                  color="gray.700"
                >
                  {subject}
                </Td>
                <Td
                  whiteSpace="nowrap"
                  fontSize="sm"
                  border="1px"
                  borderColor="gray.200"
                  fontWeight="normal"
                >
                  {level}
                </Td>
                <Td whiteSpace="nowrap" p={4} fontSize="sm">
                  ${price}/hr
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Box border="1px" borderColor="gray.200" shadow="sm" rounded="lg" p={4}>
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Text as="p" color="gray.500">
            Qualification
          </Text>
          <Flex
            bg="white"
            justifyContent="center"
            alignItems="center"
            border="1px"
            rounded="full"
            borderColor="gray.200"
            w={8}
            h={8}
          >
            <PencilIcon
              className="w-4 text-secondaryGray"
              onClick={undefined}
            />
          </Flex>
        </Flex>

        <Flex
          alignItems="start"
          borderBottom="1px"
          borderBottomColor="gray.200"
          pb="3"
        >
          <Box
            flexShrink={0}
            border="1px"
            borderColor="gray.200"
            bg="gray.50"
            p={2}
            rounded="full"
          >
            <Image
              src="/svgs/text-document.svg"
              alt=""
              h={6}
              w={6}
              color="gray.400"
            />
          </Box>

          <Box ml={3} w={0} flex={1} pt={0.5}>
            <Text fontSize="sm" fontWeight="normal">
              Indian Institute of Management (IIM), Bangalore
            </Text>
            <Text mt={1} fontSize="sm" fontWeight="normal" color="gray.600">
              Master of Business Administration (MBA), Information System
            </Text>
            <Text mt={1} fontSize="sm" fontWeight="normal" color="gray.600">
              2008 - 2010
            </Text>
          </Box>
        </Flex>

        <Flex alignItems="start" pt="3">
          <Box
            flexShrink={0}
            border="1px"
            borderColor="gray.200"
            bg="gray.50"
            p={2}
            rounded="full"
          >
            <Image
              src="/svgs/text-document.svg"
              alt=""
              h={6}
              w={6}
              color="gray.400"
            />
          </Box>

          <Box ml={3} w={0} flex={1} pt={0.5}>
            <Text fontSize="sm" fontWeight="normal">
              Indian Institute of Management (IIM), Bangalore
            </Text>
            <Text mt={1} fontSize="sm" fontWeight="normal" color="gray.600">
              Master of Business Administration (MBA), Information System
            </Text>
            <Text mt={1} fontSize="sm" fontWeight="normal" color="gray.600">
              2008 - 2010
            </Text>
          </Box>
        </Flex>
      </Box>

      <Box
        w="full"
        border="1px"
        borderColor="gray.200"
        shadow="sm"
        rounded="lg"
        p={4}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text as="p" color="gray.600">
            Availability
          </Text>
          <Flex
            bg="white"
            border="1px"
            borderColor="gray.200"
            justifyContent="center"
            alignItems="center"
            rounded="full"
            w={8}
            h={8}
          >
            <PencilIcon
              className="w-4 text-secondaryGray"
              onClick={undefined}
            />
          </Flex>
        </Flex>
        <Box overflowX="hidden" mt={4}>
          <Table w="full" overflowX="auto" border="1px" borderColor="gray.200">
            <Thead>
              <Tr borderBottom="1px" borderBottomColor="gray.200">
                <Th
                  scope="col"
                  py={3.5}
                  pr={4}
                  textAlign="left"
                  fontSize="sm"
                  fontWeight="semibold"
                  bg="#F2F4F7"
                  pl={{ base: 0, sm: 4 }}
                ></Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Mon
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  borderX="1px"
                  borderColor="gray.200"
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Tue
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Wed
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  borderX="1px"
                  borderColor="gray.200"
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Thur
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Fri
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  borderX="1px"
                  borderColor="gray.200"
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Sat
                </Th>
                <Th
                  scope="col"
                  py={3.5}
                  px={4}
                  textAlign="left"
                  fontSize="sm"
                  textTransform="capitalize"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  Sun
                </Th>
              </Tr>
            </Thead>
            <Tbody className="divide-y divide-gray-200 bg-white">
              <Tr>
                <Td
                  py={4}
                  px={4}
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  bg="#F2F4F7"
                >
                  <Flex alignItems="center" color="gray.700">
                    <Image w={5} h={5} src="/svgs/cloud.svg" alt="" />
                    <Text as="p" mx={2}>
                      8 AM
                    </Text>
                    <ArrowRightIcon className="w-4" onClick={undefined} />
                    <Text as="p">12 AM</Text>
                  </Flex>
                </Td>
                <Td
                  bgImage="url('/patterns/profile-pattern.svg')"
                  fontWeight="normal"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  bgImage="url('/patterns/profile-pattern.svg')"
                  border="1px"
                  borderColor="gray.200"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  bgImage="url('/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  border="1px"
                  bgImage="url('/patterns/profile-pattern.svg')"
                  borderColor="gray.200"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  bg="white"
                  bgImage="url('/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  border="1px"
                  bgImage="url('/patterns/profile-pattern.svg')"
                  borderColor="gray.200"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  bgImage="url('/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
              </Tr>
              <Tr>
                <Td
                  py={4}
                  px={4}
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  bg="#F2F4F7"
                >
                  <Flex alignItems="center" color="gray.700">
                    <Image w={5} h={5} src="/svgs/cloud.svg" alt="" />
                    <Text as="p" mx={2}>
                      12 AM
                    </Text>
                    <ArrowRightIcon className="w-4" onClick={undefined} />
                    <Text as="p">5 AM</Text>
                  </Flex>
                </Td>
                <Td
                  fontWeight="normal"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  whiteSpace="nowrap"
                  bgImage="url('/patterns/profile-pattern.svg')"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bgImage="url('/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td bg="white" whiteSpace="nowrap" p={4} fontSize="sm">
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td bg="white" whiteSpace="nowrap" p={4} fontSize="sm">
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
              </Tr>
              <Tr>
                <Td
                  py={4}
                  px={4}
                  fontSize="xs"
                  fontWeight="semibold"
                  color="gray.600"
                  bg="#F2F4F7"
                >
                  <Flex alignItems="center" color="gray.700">
                    <Image w={5} h={5} src="/svgs/cloud.svg" alt="" />
                    <Text as="p" mx={2}>
                      5 AM
                    </Text>
                    <ArrowRightIcon className="w-4" onClick={undefined} />
                    <Text as="p">9 AM</Text>
                  </Flex>
                </Td>
                <Td
                  fontWeight="normal"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  bgImage="url('/public/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bgImage="url('/public/patterns/profile-pattern.svg')"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                ></Td>
                <Td bg="white" whiteSpace="nowrap" p={4} fontSize="sm">
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td
                  border="1px"
                  borderColor="gray.200"
                  bg="white"
                  whiteSpace="nowrap"
                  p={4}
                  fontSize="sm"
                >
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
                <Td bg="white" whiteSpace="nowrap" p={4} fontSize="sm">
                  <CheckIcon className="text-green-500 w-7 h-7" />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </div>
  );
}
