import { classNames } from '../helpers';
import { Date } from './index';
import {
  Text,
  Flex,
  Box,
  Image,
  Container,
  Button,
  UnorderedList,
  ListItem,
  Grid,
  GridItem,
  Heading
} from '@chakra-ui/react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  CircleStackIcon
} from '@heroicons/react/20/solid';
import React, { Fragment } from 'react';

interface Transaction {
  id: number;
  content: string;
  target: string;
  href: string;
  date: string;
  icon: React.ComponentType<any>;
}

interface Event {
  id: number;
  name: string;
  lastSeen: string;
  time: string;
  color: string;
  backgroundColor: string;
  commenters: Commenter[];
}

interface Commenter {
  id: number;
  name: string;
  imageUrl: string;
  backgroundColor?: string;
}

const transactions: Transaction[] = [
  {
    id: 1,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 2,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 3,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  },
  {
    id: 4,
    content:
      ' Your received a payment of $10.95 from Leslie Peters for Chemistry Lessons',
    target: 'Front End Developer',
    href: '#',
    date: '17 May 2023 . 13:00',
    icon: CircleStackIcon
  }
];

const events: Event[] = [
  {
    id: 1,
    name: 'Upcoming chemistry session with Liam Kelly',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'orange.500',
    backgroundColor: 'orange.50',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 4,
        name: 'Lindsay Walton',
        imageUrl: '/svgs/feather.svg',
        backgroundColor: 'blue.500'
      }
    ]
  },
  {
    id: 2,
    name: 'Upcoming chemistry session with Liam Kelly',
    lastSeen: '03:30 pm',
    time: '04:30 pm',
    color: 'blue.500',
    backgroundColor: 'blue.50',
    commenters: [
      {
        id: 12,
        name: 'Emma Dorsey',
        imageUrl:
          'https://images.unsplash.com/photo-1505840717430-882ce147ef2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 6,
        name: 'Tom Cook',
        imageUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  }
];

function EventItem({ event }: { event: Event }) {
  return (
    <Flex as="li" bg={event.backgroundColor} gap={3}>
      <Box
        bg={event.color}
        roundedBottomRight="full"
        roundedTopRight="full"
        w={1}
        minH="fit-content"
      />
      <Box py={2}>
        <Flex gap={1}>
          <Box minW={0}>
            <Text as="p" fontSize="xs" fontWeight="normal" color="gray.500">
              {event.name}
            </Text>
            <Flex
              as="p"
              mt={1}
              alignItems="center"
              isTruncated
              fontSize="xs"
              color="gray.500"
            >
              <Text as="span">{event.lastSeen}</Text>
              <ChevronRightIcon className="w-4 h-4" />
              <Text as="span">{event.time}</Text>
            </Flex>
          </Box>
        </Flex>
        <Box className="flex -space-x-0.5">
          <Box as="dt" className="sr-only">
            Commenters
          </Box>
          {event.commenters.map((commenter) => (
            <Box key={commenter.id}>
              <Image
                bg={
                  commenter.backgroundColor
                    ? commenter.backgroundColor
                    : 'gray.50'
                }
                ring={2}
                ringColor="white"
                h={5}
                w={5}
                rounded="full"
                src={commenter.imageUrl}
                alt={commenter.name}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Flex>
  );
}

export default function RecentTransaction() {
  return (
    <Container maxW="7xl" mx="auto" py="10" paddingX={{ base: '4', md: '6' }}>
      <Grid
        mx={{ lg: '0' }}
        maxW={{ lg: 'none' }}
        alignItems="start"
        gap={8}
        templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
        templateRows={{ base: '1fr', lg: 'repeat(1, 1fr)' }}
      >
        {/* Invoice summary */}
        <GridItem
          gridColumnStart={{ lg: 3 }}
          gridRowEnd={{ lg: 1 }}
          p={2}
          rounded="lg"
          shadow="sm"
          ring="1"
          ringColor="gray.200"
        >
          <Heading as="h2" srOnly>
            Summary
          </Heading>

          <Flex
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px"
            borderBottomColor="gray.200"
            pb={4}
          >
            <Flex align="center">
              <Image src="/svgs/timer.svg" alt="" h={6} w={6} mx="auto" />
              <Text as="h4" ml={2} fontWeight="semibold">
                Schedule
              </Text>
            </Flex>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="white"
              p={2}
              borderRadius="full"
              border="1px"
              borderColor="gray.300"
            >
              <Image
                src="/svgs/calender-drop.svg"
                alt=""
                h={5}
                w={5}
                mx="auto"
              />
            </Box>
          </Flex>

          <Box>
            <Heading color="gray.400" fontSize="sm" mt={4} ml={4} as="h3">
              May
            </Heading>
            <Date />
          </Box>

          <Box as="ul">
            <Text as="h3" size="sm" color="gray.400" mt={4} ml={8}>
              Upcoming Events
            </Text>
            <UnorderedList as="ul" spacing={3} ml={0} mt={2}>
              {events.map((event) => (
                <EventItem key={event.id} event={event} />
              ))}
            </UnorderedList>
          </Box>

          <Box>
            <Text as="h3" size="sm" color="gray.400" mt={4} ml={8}>
              Tomorrow
            </Text>
            <Box>
              <Image
                src="/svgs/calender.svg"
                alt=""
                boxSize={10}
                mx="auto"
                my="2"
              />
              <Text
                textAlign="center"
                fontWeight="bold"
                fontSize="sm"
                color="gray.300"
              >
                No classes scheduled for tomorrow
              </Text>
            </Box>
          </Box>
        </GridItem>

        {/* Invoice */}
        <Box
          mx={[-4, 0]}
          p={2}
          boxShadow="sm"
          ring="1px"
          ringColor="gray.200"
          rounded={['md', 'lg']}
          gridColumn={{ lg: 'span 2' }}
          gridRow={{ lg: 'span 2', lgEnd: 2 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px"
            pb="4"
            borderBottomColor="gray.200"
          >
            <Flex align="center">
              <Image src="/svgs/wallet-money.svg" alt="" h={5} w={5} />
              <Text ml={3} as="h4">
                Recent Transactions
              </Text>
            </Flex>

            <Box
              display={{ base: 'none', md: 'flex' }}
              ml={4}
              alignItems="center"
            >
              <Menu as="div" className="relative">
                <Menu.Button
                  type="button"
                  className="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <img
                    className="h-5 w-5 -mr-1"
                    src="/svgs/calender-fill.svg"
                    alt=""
                  />
                  <span>This week</span>
                  <ChevronDownIcon
                    className="-mr-1 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            This week
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            Last week
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'block px-4 py-2 text-sm'
                            )}
                          >
                            This month
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </Box>
            <Menu as="div" className="relative ml-6 md:hidden">
              <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open menu</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          This week
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Last week
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          This month
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </Flex>

          <Box mt={4}>
            <UnorderedList listStyleType="none" mb="-8">
              {transactions.map((transaction, transactionIdx) => (
                <ListItem key={transaction.id}>
                  <Box pos="relative" pb={8}>
                    {transactionIdx !== transactions.length - 1 ? (
                      <Text
                        as="span"
                        pos="absolute"
                        left={4}
                        top={4}
                        w="0.5"
                        h="full"
                        bg="gray.200"
                        ml="-px"
                        aria-hidden="true"
                      />
                    ) : null}
                    <Flex pos="relative">
                      <Box>
                        <Flex
                          h={8}
                          w={8}
                          bg="orange.100"
                          rounded="full"
                          alignItems="center"
                          justifyContent="center"
                          ring={8}
                          ringColor="white"
                        >
                          <Image
                            h="5"
                            w="5"
                            src="/svgs/circlestack.svg"
                            alt=""
                          />
                        </Flex>
                      </Box>
                      <Box flex="1" ml="3" pt="0.5">
                        <Text
                          as="p"
                          fontSize="sm"
                          fontWeight="normal"
                          color="gray.400"
                        >
                          {transaction.date}
                        </Text>
                        <Text
                          as="p"
                          mt="1"
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.600"
                        >
                          {transaction.content}
                        </Text>
                        <Flex mt="3">
                          <Button
                            type="button"
                            rounded="full"
                            alignItems="center"
                            display="flex"
                            border="1px"
                            borderStyle="dashed"
                            bg="white"
                            p="3"
                            fontWeight="medium"
                            color="gray.400"
                            fontSize="sm"
                            _hover={{
                              color: 'gray.500'
                            }}
                            _focus={{
                              outline: 'none',
                              ring: '2',
                              ringColor: 'gray.500',
                              ringOffset: '2'
                            }}
                          >
                            <Image
                              h="5"
                              w="5"
                              className="h-5 w-5"
                              src="/svgs/receipt.svg"
                              alt=""
                            />
                            <Text as="span" display="inline-block" ml="1">
                              Transaction receipt
                            </Text>
                          </Button>
                        </Flex>
                      </Box>
                    </Flex>
                  </Box>
                </ListItem>
              ))}
            </UnorderedList>
          </Box>
        </Box>
      </Grid>
    </Container>
  );
}
