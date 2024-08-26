// Student layout

import BarnImg from '../../assets/Barn.svg';
import AskIcon from '../../assets/avatar-male.svg';
import BellDot from '../../assets/belldot.svg';
import AIChatImg from '../../assets/brain.png';
import { RiLockFill, RiLockUnlockFill } from 'react-icons/ri';
import { MdOutlineQuestionMark } from 'react-icons/md';
import { HelpModal } from '../../components';
import { SelectedNoteModal } from '../../components';
import Logo from '../../components/Logo';
import ProfileSwitchModal from '../../components/ProfileSwitchModal';
import { useStreamChat } from '../../providers/streamchat.provider';
import userStore from '../../state/userStore';
import FlashCardEventNotifier from './FlashCards/components/flashcard_event_notification';
import MenuLinedList from './components/MenuLinedList';
import Notifications from './components/Notifications';
import useNotifications from './components/useNotification';
import {
  Avatar,
  Badge,
  Box,
  BoxProps,
  Button,
  Center,
  CloseButton,
  Divider,
  Drawer,
  DrawerContent,
  Flex,
  FlexProps,
  Grid,
  HStack,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import { includes, last, split } from 'lodash';
import React, { ReactNode, useState, useEffect } from 'react';
import { IconType } from 'react-icons';
import { BsChatLeftDots, BsPin, BsBook } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { FaBell } from 'react-icons/fa';
import {
  FiBarChart2,
  FiBriefcase,
  FiChevronDown,
  FiHome,
  FiMenu
} from 'react-icons/fi';
import { GiReceiveMoney, GiBarn } from 'react-icons/gi';
import { LuBot, LuFileQuestion } from 'react-icons/lu';
import { MdOutlineQuiz } from 'react-icons/md';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from 'react-icons/md';
import { RiChat3Line } from 'react-icons/ri';
import { TbCards } from 'react-icons/tb';
import {
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
  Link
} from 'react-router-dom';
import { PiClipboardTextLight } from 'react-icons/pi';
import { RiFeedbackLine, RiQuestionMark } from '@remixicon/react';
import PlansModal from '../../components/PlansModal';
import WelcomeWalkthrough from '../../components/welcome-walkthrough';

import useCompletedStore from '../../state/useCompletedStore';

import { IoIosArrowRoundBack } from 'react-icons/io';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  requiresSubscription?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Library', icon: BsBook, path: '/dashboard/library' },
  { name: 'Notes', icon: CgNotes, path: '/dashboard/notes' },
  {
    name: 'Flashcards',
    icon: TbCards,
    path: '/dashboard/flashcards',
    requiresSubscription: true
  },
  {
    name: 'Quizzes',
    icon: LuFileQuestion,
    path: '/dashboard/quizzes',
    requiresSubscription: true
  }
];
interface SidebarProps extends BoxProps {
  onClose: () => void;
  toggleMenu: () => void;
  toggleChatMenu: () => void;
  toggleEarnMenu: () => void;
  tutorMenu: boolean;
  setTutorMenu: (value: boolean) => void;
  aiChatMenu: boolean;
  // setAiChatMenu: (value: boolean) => void;
  earnMenu: boolean;
  // setEarnMenu: (value: boolean) => void;
  unreadCount: number;
  openModal: (content: any) => void;
  closeModal: () => void;
}
interface NavItemProps extends FlexProps {
  icon?: IconType;
  type?: 'external' | 'internal';
  children: any;
  path: string;
  isDisabled?;
  isLocked?: boolean;
  onLockedClick?: any;
  message?: string;
  subMessage?: string;
  onClose?: () => void;
}

const NavItem = ({
  icon,
  path,
  children,
  type = 'internal',
  isLocked,
  onLockedClick,
  message,
  subMessage,
  isDisabled = false,
  onClose, // Added the onClose prop here
  ...rest
}: NavItemProps) => {
  const { pathname } = useLocation();
  const [isHovering, setIsHovering] = useState(false);

  const isActive =
    pathname === path ||
    (pathname.startsWith(path) && path.split('/').length > 2);

  const onClick = (e) => {
    // Prevent action if the item is disabled or locked
    if (isDisabled || (isLocked && onLockedClick)) {
      e.preventDefault();
      if (isLocked) {
        onLockedClick(message, subMessage);
      }
      return; // Stop the function if the item is disabled or locked
    }
    if (onClose) {
      // Call onClose if it's provided
      onClose();
    }
  };

  const disabledStyle: any = isDisabled
    ? {
        cursor: 'not-allowed',
        pointerEvents: 'none'
      }
    : {};

  const renderLinkContent = () => (
    <Flex
      align="center"
      pl="4"
      py="2"
      mx="4"
      my="2"
      borderRadius="lg"
      role="group"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      _hover={{
        bg: isDisabled ? undefined : '#F0F6FE',
        color: isDisabled ? undefined : '#207DF7'
      }}
      bg={isActive && !isDisabled ? '#F0F6FE' : 'transparent'}
      color={isActive && !isDisabled ? '#207DF7' : 'text.400'}
      fontSize={14}
      fontWeight={isActive ? '500' : '400'}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...rest}
      {...disabledStyle}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          _groupHover={{
            color: isDisabled ? undefined : '#207DF7' // No icon color change when disabled
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  );

  if (type === 'external' && !isDisabled) {
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', ...disabledStyle }}
        onClick={onClick}
      >
        {renderLinkContent()}
      </a>
    );
  }

  return (
    <Link
      to={path}
      style={{ textDecoration: 'none', ...disabledStyle }}
      onClick={onClick}
    >
      {renderLinkContent()}
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const auth = getAuth();
  const { user, logoutUser } = userStore();
  const userId = user?._id || '';
  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };
  const [toggleOnboardModal, setToggleOnboardModal] = useState(false);
  const [toggleProfileSwitchModal, setToggleProfileSwitchModal] =
    useState(false);
  const activateProfileSwitchModal = () => {
    setToggleProfileSwitchModal(true);
  };
  const setOpenWelcome = useCompletedStore((state) => state.setOpen);
  const navigate = useNavigate();

  const { notifications, hasUnreadNotification, markAllAsRead, markAsRead } =
    useNotifications(userId);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      sessionStorage.clear();
      localStorage.clear();
      logoutUser();
      navigate('/login');
    });
  };

  useEffect(() => {
    const justSignedIn = sessionStorage.getItem('Just Signed in');
    if (
      user &&
      user.onboardCompleted &&
      justSignedIn &&
      justSignedIn === 'true'
    ) {
      activateHelpModal();
      sessionStorage.removeItem('Just Signed in');
    }
  }, []);

  // function handleMenuButtonClick(callback) {
  //   setTimeout(callback, 15000);
  // }
  const name = user ? `${user.name?.first} ${user.name?.last}` : 'John Doe';
  return (
    <>
      <Flex
        px={{ base: 4, md: 4 }}
        width={{ base: '100%', sm: '100%', md: 'calc(100vw - 250px)' }}
        height="20"
        alignItems="center"
        zIndex={4}
        bg={useColorModeValue('white', 'gray.900')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        position="fixed"
        top="0"
        {...rest}
        style={{
          zIndex: 30
        }}
      >
        <Box display={{ base: 'none', md: 'flex' }} gap={2}>
          <Flex
            alignItems={'center'}
            onClick={() => navigate(-1)}
            _hover={{ cursor: 'pointer' }}
          >
            <IoIosArrowRoundBack />
            {/* <Text fontSize={12}>Back</Text> */}
          </Flex>
          <Flex
            bgColor={'transparent'}
            color="text.400"
            border="1px solid #EBECF0"
            borderRadius={'40px'}
            fontSize="14px"
            p="6px 16px"
            onClick={activateHelpModal}
            gap={2}
            _hover={{
              cursor: 'pointer',
              bgColor: '#EDF2F7',
              transform: 'translateY(-2px)'
            }}
          >
            {/* <Image src={AskIcon} /> */}
            {<AskIcon />}
            <Text> Ask Shep?</Text>
          </Flex>
        </Box>

        <Spacer display={{ base: 'none', md: 'flex' }} />
        <Flex
          justifyContent={'space-between'}
          width={{ base: 'inherit', md: 'auto' }}
        >
          {' '}
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
          {/* <Box display={{ base: 'flex', md: 'none' }}>
            <Flex
              bgColor={'transparent'}
              color="text.400"
              border="1px solid #EBECF0"
              borderRadius={'40px'}
              fontSize={{ base: '10px' }}
              p="6px 16px"
              onClick={activateHelpModal}
              gap={2}
              _hover={{
                cursor: 'pointer',
                bgColor: '#EDF2F7',
                transform: 'translateY(-2px)'
              }}
            >
              <Image src={AskIcon} />
              <Text> Ask Sheps?</Text>
            </Flex>
          </Box> */}
          <HStack spacing={4}>
            {/* <RiQuestionMark
              className="cursor-pointer"
              onClick={() => {
                setOpenWelcome(true);
              }}
            /> */}
            <IconButton
              size="md"
              borderRadius={'100%'}
              _hover={{ background: 'none' }}
              marginLeft={'15px'}
              border="1px solid #ECEDEE"
              variant="ghost"
              aria-label="open onboard menu"
              color={'text.300'}
              icon={<MdOutlineQuestionMark />}
              onClick={() => {
                setToggleOnboardModal(true);
              }}
            />
            <Box position="relative">
              {' '}
              <Menu placement="right">
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
                <MenuList
                  p={3}
                  width={'358px'}
                  zIndex={2}
                  sx={{ position: 'absolute', top: '30px', right: '2px' }}
                >
                  <Notifications
                    data={notifications}
                    handleAllRead={markAllAsRead}
                    handleRead={markAsRead}
                  />
                </MenuList>
              </Menu>
            </Box>

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
              >
                <HStack>
                  <Avatar size="sm" color="white" name={name} bg="#4CAF50;" />
                  <Text
                    fontSize="14px"
                    fontWeight={500}
                    color="text.200"
                    display={{ base: 'none', sm: 'none', md: 'block' }}
                  >
                    {name}
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
                      bgColor="#EBF4FE"
                      color="#207DF7"
                      p="2px 8px"
                      maxWidth="fit-content"
                      borderRadius="4px"
                    >
                      <Text fontSize={10} fontWeight={500}>
                        Student
                      </Text>
                    </Box>
                  </Stack>
                </Flex>
                <Divider />
                <MenuItem p={2} m={1}>
                  <Link to="/dashboard/account-settings">
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
        </Flex>
      </Flex>
      <HelpModal
        toggleHelpModal={toggleHelpModal}
        setToggleHelpModal={setToggleHelpModal}
      />
      <WelcomeWalkthrough
        toggleOnboardModal={toggleOnboardModal}
        setToggleOnboardModal={setToggleOnboardModal}
      />
      <ProfileSwitchModal
        toggleProfileSwitchModal={toggleProfileSwitchModal}
        setToggleProfileSwitchModal={setToggleProfileSwitchModal}
      />
    </>
  );
};
const SidebarContent = ({
  onClose,
  tutorMenu,
  setTutorMenu,
  aiChatMenu,
  earnMenu,
  toggleMenu,
  toggleChatMenu,
  toggleEarnMenu,
  unreadCount,
  hasActiveSubscription,
  handleLockedClick,
  openModal,
  closeModal,
  ...rest
}: SidebarProps & {
  hasActiveSubscription: boolean;
  handleLockedClick: (message: string, subMessage: string) => void;
}) => {
  const { pathname } = useLocation();
  const [showSelected, setShowSelected] = useState(false);

  const handleShowSelected = () => {
    setShowSelected(true);
  };

  const [isHovering, setIsHovering] = useState(false);
  const { user }: any = userStore();
  // const { unreadCount } = useStreamChat();

  return (
    <div className="overflow-hidden transition-all bg-white border-r w-full h-full fixed max-w-[250px]">
      <div className="flex items-center justify-between h-[5rem] mx-[2rem]">
        <h4 className="font-bold">
          <Logo />
        </h4>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </div>
      <NavItem icon={FiHome} path={'/dashboard'} onClose={onClose}>
        Home
      </NavItem>
      <Divider />
      <Box
        paddingLeft={8}
        paddingRight={4}
        color="text.400"
        display={aiChatMenu ? 'block' : 'flex'}
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => toggleChatMenu()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <HStack width={'100%'} justifyContent="space-between">
          <Button
            variant={'unstyled'}
            display="flex"
            alignSelf="start"
            gap={'10px'}
            leftIcon={<RiChat3Line width={18} />}
            fontSize={14}
            fontWeight={500}
            onClick={
              () => toggleChatMenu()
              // hasActiveSubscription
              //   ? () => toggleChatMenu()
              //   : () =>
              //       handleLockedClick(
              //         !user.hadSubscription
              //           ? 'Start Your Free Trial!'
              //           : 'Pick a plan to access your AI Study Tools! 🚀',
              //         'One-click Cancel at anytime.'
              //       )
            }
            rightIcon={
              aiChatMenu ? (
                <MdOutlineKeyboardArrowUp />
              ) : (
                <MdOutlineKeyboardArrowDown />
              )
            }
          >
            AI Chat
          </Button>
        </HStack>
        <Box display={aiChatMenu ? 'block' : 'none'} alignSelf="start">
          <MenuLinedList
            items={[
              {
                title: 'Docchat',
                path: '',
                onClick: handleShowSelected
              },
              {
                title: 'AI tutor',
                path: '/dashboard/ace-homework'
              }
            ]}
            onClose={onClose}
          />
        </Box>
      </Box>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.path}
          onClose={onClose}
          isLocked={false} //link.requiresSubscription && !hasActiveSubscription
          onLockedClick={
            link.requiresSubscription
              ? () =>
                  handleLockedClick(
                    !user.hadSubscription
                      ? 'Subscribe to unlock your AI Study Tools! 🚀'
                      : 'Pick a plan to access your AI Study Tools! 🚀',
                    'One-click Cancel at anytime.'
                  )
              : undefined
          }
        >
          {link.name}
        </NavItem>
      ))}
      <Box ml={8} mb={2} color="text.400">
        <Button
          pointerEvents={'none'}
          variant={'unstyled'}
          display="flex"
          gap={2}
          leftIcon={<PiClipboardTextLight />}
          // onClick={() => toggleChatMenu()}
          fontSize={14}
          fontWeight={400}
          width="100%"
          pr={2}
        >
          <Flex align="center" justify="space-between" pr={2} width="100%">
            <Text>Study Plans</Text>
            <Text
              fontSize={10}
              border="1px solid #fc9b65"
              borderRadius={4}
              color="#fc9b65"
              alignSelf={'center'}
              px={1}
            >
              Coming Soon
            </Text>
          </Flex>
        </Button>
      </Box>

      <Divider />
      <Box ml={8} color="text.400">
        {' '}
        <Button
          variant={'unstyled'}
          display="flex"
          gap={'10px'}
          leftIcon={<FiBriefcase />}
          fontSize={14}
          fontWeight={500}
          onClick={() => setTutorMenu(!tutorMenu)}
          rightIcon={
            tutorMenu ? (
              <MdOutlineKeyboardArrowUp />
            ) : (
              <MdOutlineKeyboardArrowDown />
            )
          }
        >
          Shepherds
        </Button>
        <Box display={tutorMenu ? 'block' : 'none'}>
          <MenuLinedList
            items={[
              {
                title: 'Find a Shepherd',
                path: '/dashboard/find-tutor'
              },
              {
                title: 'My Shepherds',
                path: '/dashboard/my-tutors'
              },
              {
                title: 'Bookmarks',
                path: '/dashboard/saved-tutors'
              },
              {
                title: 'Bounties',
                path: '/dashboard/bounties'
              }
            ]}
            onClose={onClose}
          />
        </Box>
      </Box>

      <NavItem
        icon={BsChatLeftDots}
        path="/dashboard/messaging"
        onClose={onClose}
      >
        Shepherd Chat
        {unreadCount > 0 && ( // Display badge if there are unread messages
          <Badge colorScheme="red" ml={2}>
            {unreadCount}
          </Badge>
        )}
      </NavItem>

      <Divider />

      <Box ml={8} color="text.400">
        <Button
          cursor={'not-allowed'}
          pointerEvents={'none'}
          opacity={1}
          variant={'unstyled'}
          display="flex"
          gap={2}
          leftIcon={<BarnImg />}
          onClick={() => openModal('Coming Soon!')}
          fontSize={14}
          fontWeight={400}
          width="100%"
          pr="2"
          my="2"
        >
          <Flex align="center" justify="space-between" pr={2} width="100%">
            <Text>Barn</Text>
            <Text
              fontSize={10}
              border="1px solid #fc9b65"
              borderRadius={4}
              color="#fc9b65"
              alignSelf={'center'}
              px={1}
              ml="auto"
            >
              Coming Soon
            </Text>
          </Flex>
        </Button>
      </Box>
      <Divider />
      <NavItem
        icon={RiFeedbackLine as unknown as IconType}
        type="external"
        path="https://shepherdtutors.canny.io/shepherd/p/feature-requests"
        onClose={onClose}
      >
        Feedback
      </NavItem>
      {showSelected && (
        <SelectedNoteModal show={showSelected} setShow={setShowSelected} />
      )}
    </div>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [tutorMenu, setTutorMenu] = useState(false);
  const [aiChatMenu, setAiChatMenu] = useState(false);
  const [earnMenu, setEarnMenu] = useState(false);
  const [uploadDocumentModal, setUploadDocumentModal] = useState(false);
  const { user, hasActiveSubscription }: any = userStore();
  const [togglePlansModal, setTogglePlansModal] = useState(false);
  const [plansModalMessage, setPlansModalMessage] = useState('');
  const [plansModalSubMessage, setPlansModalSubMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [toggleOnboardModal, setToggleOnboardModal] = useState(false);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  const handleLockedClick = (message, subMessage) => {
    setPlansModalMessage(message);
    setPlansModalSubMessage(subMessage);
    setTogglePlansModal(true);
  };

  const {
    unreadCount,
    connectUserToChat,
    userType,
    setUserRoleInfo,
    userRoleId,
    userRoleToken
  } = useStreamChat();

  const toggleMenu = () => {
    setTutorMenu(!tutorMenu);
  };
  const toggleChatMenu = () => {
    setAiChatMenu(!aiChatMenu);
  };
  const toggleEarnMenu = () => {
    setEarnMenu(!earnMenu);
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (user) {
      const role = user[userType];
      const token = user.streamTokens?.find((token) => token.type === userType);
      //@ts-ignore: petty ts check
      setUserRoleInfo(role?._id, token?.token);
      setToggleOnboardModal(
        typeof user.onboardCompleted !== 'undefined' && !user.onboardCompleted
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (userRoleId && userRoleToken) {
      connectUserToChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoleId, userRoleToken]);

  return (
    <>
      <WelcomeWalkthrough
        toggleOnboardModal={toggleOnboardModal}
        setToggleOnboardModal={setToggleOnboardModal}
      />
      <FlashCardEventNotifier />
      <div className="flex flex-col w-full h-full relative bg-white">
        <div className="h-full flex w-full">
          <div className="hidden md:block md:w-[250px] shrink-0 overflow-auto border-r">
            <SidebarContent
              onClose={() => onClose}
              tutorMenu={tutorMenu}
              aiChatMenu={aiChatMenu}
              earnMenu={earnMenu}
              setTutorMenu={setTutorMenu}
              toggleMenu={toggleMenu}
              toggleChatMenu={toggleChatMenu}
              toggleEarnMenu={toggleEarnMenu}
              display={{ base: 'none', md: 'block' }}
              unreadCount={unreadCount}
              hasActiveSubscription={hasActiveSubscription}
              handleLockedClick={handleLockedClick}
              openModal={openModal}
              closeModal={closeModal}
            />
            <Drawer
              autoFocus={false}
              isOpen={isOpen}
              placement="left"
              onClose={onClose}
              returnFocusOnClose={false}
              onOverlayClick={onClose}
              size="full"
            >
              <DrawerContent>
                <SidebarContent
                  onClose={onClose}
                  tutorMenu={tutorMenu}
                  setTutorMenu={setTutorMenu}
                  toggleMenu={() => setTutorMenu(!tutorMenu)}
                  aiChatMenu={aiChatMenu}
                  // setAiChatMenu={setAiChatMenu}
                  toggleChatMenu={toggleChatMenu}
                  earnMenu={earnMenu}
                  toggleEarnMenu={toggleEarnMenu}
                  unreadCount={unreadCount}
                  hasActiveSubscription={hasActiveSubscription}
                  handleLockedClick={handleLockedClick}
                  openModal={openModal}
                  closeModal={closeModal}
                />
              </DrawerContent>
            </Drawer>
          </div>
          <div className="flex-1 overflow-y-hidden h-full">
            <div className="w-full z-10">
              <MobileNav onOpen={onOpen} />
            </div>
            <div className="box pt-20 relative h-full overflow-y-scroll">
              <Outlet />
              {children}
            </div>
          </div>
        </div>
      </div>
      {togglePlansModal && (
        <PlansModal
          togglePlansModal={togglePlansModal}
          setTogglePlansModal={setTogglePlansModal}
          message={plansModalMessage}
          subMessage={plansModalSubMessage}
        />
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export const CustomButton = (props: any) => {
  const { buttonText, fontStyle, buttonType, onClick, padding, icon } = props;
  return (
    <Box
      as="button"
      lineHeight="1.2"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      border="1px"
      padding={padding ? padding : '9px 20px'}
      mx="4px"
      alignItems="center"
      borderRadius="8px"
      fontSize={fontStyle ? fontStyle.fontSize : '14px'}
      fontWeight={fontStyle ? fontStyle.fontWeight : 'semibold'}
      bg={buttonType === 'outlined' ? 'transparent' : '#207DF7'}
      borderColor={buttonType === 'outlined' ? 'transparent' : '#ccd0d5'}
      color={buttonType === 'outlined' ? '#207DF7' : '#fff'}
      _hover={{
        bg: buttonType === 'outlined' ? '#E2E8F0' : '#1964c5',
        transform: 'translateY(-2px)',
        boxShadow: 'lg'
      }}
      _active={{
        bg: '#dddfe2',
        transform: 'scale(0.98)',
        borderColor: '#bec3c9'
      }}
      _focus={{
        boxShadow:
          '0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)'
      }}
      onClick={onClick}
      {...props}
    >
      <span style={{ marginRight: '10px' }}>{icon}</span> {buttonText}
    </Box>
  );
};
