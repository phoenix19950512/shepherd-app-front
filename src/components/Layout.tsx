import { QuestionIcon } from '@chakra-ui/icons';
import BellDot from '../assets/belldot.svg';
import { classNames } from '../helpers';
import { useStreamChat } from '../providers/streamchat.provider';
import tutorStore from '../state/tutorStore';
import userStore from '../state/userStore';
import Notifications from '../views/Dashboard/components/Notifications';
import useNotifications from '../views/Dashboard/components/useNotification';
import ProfileSwitchModal from './ProfileSwitchModal';
import {
  DashboardIcon,
  OffersIcon,
  MessagesIcon,
  UserGroupIcon,
  BountyIcon,
  UserIcon,
  ChevronRightIcon, // NotesIcon,
  LogoutIcon
} from './icons';
import { HelpModal, UploadDocumentModal } from './index';
import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  MenuButton,
  Text,
  IconButton,
  Menu,
  MenuList,
  MenuDivider,
  Stack,
  Divider,
  Center,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';
import {
  Bars3Icon,
  Cog6ToothIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { getAuth, signOut } from 'firebase/auth';
import React, { Fragment, useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useLocation, Link, useNavigate, Outlet } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { PiClipboardTextLight } from 'react-icons/pi';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
}

export default function Layout({ children, className }) {
  const { user, fetchUser } = userStore();
  const [helpModal, setHelpModal] = useState(false);
  const [toggleHelpModal, setToggleHelpModal] = useState(false);

  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toggleProfileSwitchModal, setToggleProfileSwitchModal] =
    useState(false);
  const dummyNavigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard/tutordashboard',
      icon: DashboardIcon,
      current: true
    },
    {
      name: 'Students',
      href: '/dashboard/tutordashboard/clients',
      icon: UserGroupIcon,
      current: false
    },
    !user.school && {
      name: 'Offers',
      href: '/dashboard/tutordashboard/offers',
      icon: OffersIcon,
      current: false
    },
    !user.school && {
      name: 'Bounties',
      href: '/dashboard/tutordashboard/bounties',
      icon: BountyIcon,
      current: false
    },
    {
      name: 'Messages',
      href: '/dashboard/tutordashboard/messages',
      icon: MessagesIcon,
      current: false
    },
    {
      name: 'Study Plans',
      href: '/dashboard/tutordashboard/study-plans',
      icon: PiClipboardTextLight,
      current: false
    }
  ].filter(Boolean);
  const [navigation, setNavigation] =
    useState<NavigationItem[]>(dummyNavigation);
  const location = useLocation();
  const navigate = useNavigate();

  const userId = user?._id || '';
  const { notifications, hasUnreadNotification, markAllAsRead } =
    useNotifications(userId);
  const auth = getAuth();

  const activateProfileSwitchModal = () => {
    setToggleProfileSwitchModal(true);
  };
  const pathname = location.pathname;
  const {
    unreadCount,
    connectUserToChat,
    userType,
    setUserRoleInfo,
    userRoleId,
    userRoleToken,
    disconnectAndReset
  } = useStreamChat();

  useEffect(() => {
    const temp: NavigationItem[] = navigation.map((nav) => {
      nav.current = false;
      if (nav.href === `/${pathname}`) {
        nav.current = true;
      }
      return nav;
    });
    setNavigation(temp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const isActive = user?.tutor?.isActive;
    if (!isActive) {
      navigate('/activation_pending');
    }
  }, [user]);

  useEffect(() => {
    // disconnectAndReset();
    if (user) {
      const role = user[userType];
      const token = user.streamTokens?.find((token) => token.type === userType);
      //@ts-ignore: petty ts check
      setUserRoleInfo(role?._id, token?.token);
      // return () => {
      //   connectUserToChat();
      // };
    }

    // return () => {
    //   disconnectAndReset();
    // };
  }, [user]);

  useEffect(() => {
    if (userRoleId && userRoleToken) {
      connectUserToChat();
    }
  }, [userRoleId, userRoleToken]);

  //  useEffect(() => {
  //    connectUserToChat();
  //  }, []);

  const handleSignOut = () => {
    disconnectAndReset();
    sessionStorage.clear();
    signOut(auth).then(() => {
      navigate('/login');
    });
  };

  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <img
                      className="h-10 w-auto"
                      src="/svgs/logo.svg"
                      alt="Sherperd"
                    />
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 space-y-1">
                          {navigation.map((item) => {
                            const activePath =
                              pathname === item.href ||
                              (pathname.startsWith(item.href) &&
                                item.href.split('/').length > 3);
                            return (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    activePath
                                      ? 'bg-slate-100 text-blue-400'
                                      : 'text-gray-400 hover:text-blue-400 hover:bg-slate-100',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? 'text-blue-500'
                                        : 'text-gray-400 group-hover:text-blue-400',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                      <li className="border-t pt-4">
                        <a
                          href="/dashboard/tutordashboard/account-settings"
                          className={classNames(
                            pathname ===
                              '/dashboard/tutordashboard/account-settings'
                              ? 'bg-slate-100 text-blue-400'
                              : 'text-gray-400 hover:text-blue-400 hover:bg-slate-100',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <Cog6ToothIcon
                            className={classNames(
                              pathname ===
                                '/dashboard/tutordashboard/account-settings'
                                ? 'text-blue-500'
                                : 'text-gray-400 group-hover:text-blue-400',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          Settings
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <Box
        className="hidden relative bg-white lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col border-r"
        overflowY="auto"
        px={6}
        pb={4}
      >
        <Flex h="16" alignItems="center">
          <img className="h-10 w-auto" src="/svgs/logo.svg" alt="Sherperd" />
        </Flex>
        <nav className="flex flex-1 flex-col pt-3">
          <Box as="ul" className="flex flex-1 flex-col gap-y-2">
            {navigation.map((item) => {
              const activePath =
                pathname === item.href ||
                (pathname.startsWith(item.href) &&
                  item.href.split('/').length > 3);
              return (
                <Box key={item.name} as="li">
                  <Link
                    to={item.href}
                    className={`${
                      activePath
                        ? 'bg-slate-100 text-primaryBlue'
                        : 'text-gray-400 hover:text-primaryBlue hover:bg-slate-100'
                    } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium items-center`}

                    // display="flex"
                    // alignItems="center"
                  >
                    <Icon
                      as={item.icon}
                      className={`${
                        item.current
                          ? 'text-primaryBlue'
                          : 'text-gray-400 group-hover:text-primaryBlue'
                      } h-6 w-6 shrink-0`}
                      aria-hidden="true"
                    />
                    <Text fontSize={14} fontWeight={activePath ? '500' : '400'}>
                      {item.name}
                    </Text>
                    {item.name === 'Messages' &&
                      unreadCount > 0 && ( // Display badge if there are unread messages
                        <Badge colorScheme="red" ml={2}>
                          {unreadCount}
                        </Badge>
                      )}
                  </Link>
                </Box>
              );
            })}
          </Box>
          <Box className="border-t pt-4">
            <Link
              to="tutordashboard/account-settings"
              className={`${
                pathname === '/dashboard/tutordashboard/account-settings'
                  ? 'bg-slate-100 text-primaryBlue'
                  : 'text-gray-400 hover:text-primaryBlue hover:bg-slate-100'
              } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold`}
              // display="flex"
              // alignItems="center"
            >
              <Cog6ToothIcon
                className={classNames(
                  pathname === '/dashboard/tutordashboard/account-settings'
                    ? 'text-blue-500'
                    : 'text-gray-400 group-hover:text-primaryBlue',
                  'h-6 w-6 shrink-0'
                )}
                aria-hidden="true"
              />
              <Text
                fontSize={14}
                fontWeight={
                  pathname === '/dashboard/tutordashboard/account-settings'
                    ? '500'
                    : '400'
                }
              >
                Settings
              </Text>
            </Link>
          </Box>
        </nav>
      </Box>

      <div className="lg:pl-72 bg-white">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Flex
            alignItems={'center'}
            onClick={() => navigate(-1)}
            _hover={{ cursor: 'pointer' }}
            gap={1}
          >
            <IoIosArrowRoundBack />
            <Text fontSize={12}>Back</Text>
          </Flex>
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className={`flex ${
              pathname === 'clients' ? 'justify-between py-2' : 'justify-end'
            } flex-1 gap-x-4 self-stretch lg:gap-x-6`}
          >
            {pathname === 'docchat' && (
              <button
                onClick={() => setHelpModal(true)}
                className="relative flex max-w-fit items-center border rounded-full flex-1 px-4 py-1"
              >
                <div className="flex-shrink-0 p-2 flex justify-center items-center rounded-full">
                  <img
                    src="/svgs/avatar-male.svg"
                    className="h-4 w-6 text-gray-400"
                    alt=""
                  />
                </div>
                <Text className="text-primaryGray">Ask Shep?</Text>
              </button>
            )}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Show if the pathname is client */}
              {pathname === 'clients' && (
                <button
                  type="button"
                  className="inline-flex items-center gap-x-2 rounded-md bg-secondaryBlue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Create new
                </button>
              )}

              <HStack spacing={4}>
                <Menu>
                  <MenuButton>
                    <IconButton
                      size="md"
                      borderRadius={'100%'}
                      border="1px solid #ECEDEE"
                      variant="ghost"
                      aria-label="open menu"
                      color={'text.300'}
                      icon={hasUnreadNotification ? <BellDot /> : <FaBell />}
                    />
                  </MenuButton>
                  <MenuList p={3} width={'358px'} zIndex={2}>
                    <Notifications
                      data={notifications}
                      handleAllRead={markAllAsRead}
                    />
                  </MenuList>
                </Menu>
                <Center height="25px">
                  <Divider orientation="vertical" />
                </Center>
                <Menu>
                  <MenuButton
                    py={2}
                    transition="all 0.3s"
                    _focus={{ boxShadow: 'none' }}
                    bg="#F4F5F5"
                    borderRadius={'40px'}
                    px={3}
                    // minWidth={"80px"}
                  >
                    <HStack>
                      <Avatar
                        size="sm"
                        color="white"
                        name={`${user?.name?.first ?? ''} ${
                          user?.name?.last ?? ''
                        }`}
                        bg="#4CAF50;"
                      />
                      <Text
                        fontSize="14px"
                        fontWeight={500}
                        color="text.200"
                        display={{ base: 'block', sm: 'none', md: 'block' }}
                      >
                        {`${user?.name?.first} ${user?.name?.last}`}
                      </Text>

                      <Box display={{ base: 'none', md: 'flex' }}>
                        <FiChevronDown />
                      </Box>
                    </HStack>
                  </MenuButton>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.900')}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    minWidth={'200px'}
                    fontSize={'14px'}
                  >
                    <Flex gap={2} p={2}>
                      <Avatar
                        size="md"
                        color="white"
                        name={`${user?.name?.first} ${user?.name?.last}`}
                        bg="#4CAF50;"
                      />
                      <Stack spacing={'2px'}>
                        <Text
                          fontSize="14px"
                          fontWeight={500}
                          color="text.300"
                          display={{ base: 'block', sm: 'none', md: 'block' }}
                        >
                          {`${user?.name?.first} ${user?.name?.last}`}
                        </Text>{' '}
                        <Box
                          bgColor="#FFF2EB"
                          color="#FB8441"
                          p="2px 8px"
                          maxWidth="fit-content"
                          borderRadius="4px"
                        >
                          <Text fontSize={10} fontWeight={500}>
                            Tutor
                          </Text>
                        </Box>
                      </Stack>
                    </Flex>
                    <Divider />
                    <MenuItem p={2} m={1}>
                      <Link to="/dashboard/tutordashboard/account-settings">
                        <Flex alignItems="center" gap={2}>
                          {/* <PiUserCircleLight size="24px" /> */}
                          <Center
                            borderRadius="50%"
                            border="1px solid #EAEAEB"
                            boxSize="26px"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 1.16602C5.47167 1.16602 4.22917 2.40852 4.22917 3.93685C4.22917 5.43602 5.40167 6.64935 6.93 6.70185C6.97667 6.69602 7.02333 6.69602 7.05833 6.70185C7.07 6.70185 7.07583 6.70185 7.0875 6.70185C7.09333 6.70185 7.09333 6.70185 7.09917 6.70185C8.5925 6.64935 9.765 5.43602 9.77083 3.93685C9.77083 2.40852 8.52833 1.16602 7 1.16602Z"
                                fill="#6E7682"
                              />
                              <path
                                d="M9.96333 8.2532C8.33583 7.1682 5.68167 7.1682 4.0425 8.2532C3.30167 8.74904 2.89333 9.41987 2.89333 10.1374C2.89333 10.8549 3.30167 11.5199 4.03667 12.0099C4.85333 12.5582 5.92667 12.8324 7 12.8324C8.07333 12.8324 9.14667 12.5582 9.96333 12.0099C10.6983 11.514 11.1067 10.849 11.1067 10.1257C11.1008 9.4082 10.6983 8.7432 9.96333 8.2532Z"
                                fill="#6E7682"
                              />
                            </svg>
                          </Center>

                          <Text color="text.300" fontSize={14}>
                            My account
                          </Text>
                        </Flex>
                      </Link>
                    </MenuItem>
                    <MenuItem p={2} m={1} onClick={activateProfileSwitchModal}>
                      <Flex alignItems="center" gap={2}>
                        <Center
                          borderRadius="50%"
                          border="1px solid #EAEAEB"
                          boxSize="26px"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.25 1.16602C3.72167 1.16602 2.47917 2.40852 2.47917 3.93685C2.47917 5.43602 3.65167 6.64935 5.18 6.70185C5.22667 6.69602 5.27333 6.69602 5.30833 6.70185C5.32 6.70185 5.32583 6.70185 5.3375 6.70185C5.34333 6.70185 5.34333 6.70185 5.34917 6.70185C6.8425 6.64935 8.015 5.43602 8.02083 3.93685C8.02083 2.40852 6.77833 1.16602 5.25 1.16602Z"
                              fill="#6E7682"
                            />
                            <path
                              d="M8.21333 8.2532C6.58583 7.1682 3.93167 7.1682 2.2925 8.2532C1.55167 8.74904 1.14333 9.41987 1.14333 10.1374C1.14333 10.8549 1.55167 11.5199 2.28667 12.0099C3.10333 12.5582 4.17667 12.8324 5.25 12.8324C6.32333 12.8324 7.39667 12.5582 8.21333 12.0099C8.94833 11.514 9.35667 10.849 9.35667 10.1257C9.35083 9.4082 8.94833 8.7432 8.21333 8.2532Z"
                              fill="#6E7682"
                            />
                            <path
                              d="M11.6608 4.28254C11.7542 5.41421 10.9492 6.40587 9.835 6.54004C9.82917 6.54004 9.82917 6.54004 9.82334 6.54004H9.80583C9.77083 6.54004 9.73583 6.54004 9.70667 6.5517C9.14083 6.58087 8.62167 6.40004 8.23083 6.06754C8.83167 5.53087 9.17583 4.72587 9.10583 3.85087C9.065 3.37837 8.90167 2.94671 8.65667 2.57921C8.87834 2.46837 9.135 2.39837 9.3975 2.37504C10.5408 2.27587 11.5617 3.12754 11.6608 4.28254Z"
                              fill="#6E7682"
                            />
                            <path
                              d="M12.8275 9.67708C12.7808 10.2429 12.4192 10.7329 11.8125 11.0654C11.2292 11.3862 10.4942 11.5379 9.765 11.5204C10.185 11.1412 10.43 10.6687 10.4767 10.1671C10.535 9.44375 10.1908 8.74958 9.5025 8.19541C9.11167 7.88625 8.65667 7.64125 8.16084 7.46041C9.45 7.08708 11.0717 7.33791 12.0692 8.14291C12.6058 8.57458 12.88 9.11708 12.8275 9.67708Z"
                              fill="#6E7682"
                            />
                          </svg>
                        </Center>
                        <Text color="text.300" fontSize={14}>
                          Switch Account
                        </Text>
                      </Flex>
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleSignOut} p={2} m={1}>
                      <Flex alignItems="center" gap={2}>
                        <Center
                          borderRadius="50%"
                          border="1px solid #EAEAEB"
                          boxSize="26px"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.59667 7.04018C4.59667 6.80102 4.795 6.60268 5.03417 6.60268H8.23083V1.66768C8.225 1.38768 8.00333 1.16602 7.72333 1.16602C4.2875 1.16602 1.89 3.56352 1.89 6.99935C1.89 10.4352 4.2875 12.8327 7.72333 12.8327C7.9975 12.8327 8.225 12.611 8.225 12.331V7.47185H5.03417C4.78917 7.47768 4.59667 7.27935 4.59667 7.04018Z"
                              fill="#F53535"
                            />
                            <path
                              d="M11.9817 6.73078L10.325 5.06828C10.1558 4.89911 9.87583 4.89911 9.70666 5.06828C9.5375 5.23745 9.5375 5.51745 9.70666 5.68661L10.6167 6.59662H8.225V7.47162H10.6108L9.70083 8.38162C9.53166 8.55078 9.53166 8.83078 9.70083 8.99995C9.78833 9.08745 9.89916 9.12828 10.01 9.12828C10.1208 9.12828 10.2317 9.08745 10.3192 8.99995L11.9758 7.33745C12.1508 7.17411 12.1508 6.89995 11.9817 6.73078Z"
                              fill="#F53535"
                            />
                          </svg>
                        </Center>
                        <Text color="#F53535" fontSize={14}>
                          Log out
                        </Text>
                      </Flex>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </div>
          </div>
        </div>
        {/* <main className={className}>{children}</main>  */}
        <Box pt={2} position={'relative'}>
          <Outlet />
        </Box>
      </div>

      {/* Upload Document Modal */}
      <Transition.Root show={uploadDocumentModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={setUploadDocumentModal}
        >
          <UploadDocumentModal
            uploadDocumentModal={uploadDocumentModal}
            setUploadDocumentModal={setUploadDocumentModal}
          />
        </Dialog>
      </Transition.Root>
      <ProfileSwitchModal
        toggleProfileSwitchModal={toggleProfileSwitchModal}
        setToggleProfileSwitchModal={setToggleProfileSwitchModal}
      />
      {/* Help Modal */}

      <HelpModal
        toggleHelpModal={toggleHelpModal}
        setToggleHelpModal={setToggleHelpModal}
      />
    </>
  );
}
