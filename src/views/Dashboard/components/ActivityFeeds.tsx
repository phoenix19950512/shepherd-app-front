import AdobeIcon from '../../../assets/adobedoc.svg';
import FeedIcon from '../../../assets/blue-energy.svg';
import BountyChat from '../../../assets/bounty-chat.svg';
import BountyVid from '../../../assets/bounty-video.svg';
import DocIcon from '../../../assets/doc-icon.svg';
import NoteSmIcon from '../../../assets/doc-sm.svg';
import FlashcardSmIcon from '../../../assets/flashcard-sm.svg';
import ReceiptIcon from '../../../assets/flashcardIcon.svg';
import EmptyFeeds from '../../../assets/no-activity.svg';
import NoEvent from '../../../assets/no-event.svg';
import NoteIcon from '../../../assets/notes.svg';
import ReceiptSmIcon from '../../../assets/receipt-sm.svg';
import FlashcardIcon from '../../../assets/receiptIcon.svg';
import WalletIcon from '../../../assets/wallet-money.svg';
import HelpModal from '../../../components/HelpModal';
import flashcardStore from '../../../state/flashcardStore';
import { isSameDay, isSameWeek, isSameMonth } from '../../../util';
import { CustomButton } from '../layout';
import { TimeAgo } from './TimeAgo';
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  VStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { BsChevronDown, BsFiletypeDoc } from 'react-icons/bs';
import { RiCalendar2Fill } from 'react-icons/ri';
import { SlEnergy } from 'react-icons/sl';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Item = styled(Box)``;

const Root = styled(Flex)`
  position: relative;
  margin-left: 8px;
  alignitems: flex-start;
  direction: row;
  margin: 4 0;
  &:before {
    content: '';
    position: absolute;
    left: 22px;
    top: 0;
    bottom: -15px;
    width: 1px;
    background: #e8e9ed;
    z-index: 0;
  }
  &:last-child {
    &:before {
      display: none;
    }
  }

  padding-left: 0px;
`;

function ActivityFeeds(props) {
  const { feeds, userType } = props;

  const { loadFlashcard, fetchSingleFlashcard } = flashcardStore();
  const [feedPeriod, setFeedPeriod] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');

  const [toggleHelpModal, setToggleHelpModal] = useState(false);
  const activateHelpModal = () => {
    setToggleHelpModal(true);
  };
  const navigate = useNavigate();
  const getFileName = (url) => {
    if (!url) return '';
    const isFirebaseStorageUrl = url.includes('firebasestorage.googleapis.com');
    const isAmazonS3Url = url.includes('amazonaws.com');

    if (isFirebaseStorageUrl) {
      const startIndex = url.lastIndexOf('%2F'); // Adjust the start index
      const endIndex = url.indexOf('?alt');
      const extractedText = url.substring(startIndex, endIndex);

      const result = extractedText.replace(/%20/g, ' ').replace(/%2F/g, '');
      if (result.length > 30) {
        return result.substring(0, 20) + '...';
      } else {
        return result;
      }
    } else if (isAmazonS3Url) {
      const lastSlashIndex = url.lastIndexOf('/');
      const textAfterLastSlash = url.substring(lastSlashIndex + 1);

      const startIndex = textAfterLastSlash.indexOf('%2F'); // Adjust the start index
      const endIndex = textAfterLastSlash.length;
      const extractedText = textAfterLastSlash.substring(startIndex, endIndex);

      const result = extractedText.replace(/%20/g, ' ').replace(/%2F/g, '');

      if (result.length > 30) {
        return result.substring(0, 20) + '...';
      } else {
        return result;
      }
    }
  };

  const [filteredFeeds, setFilteredFeeds] = useState<any[]>([]);

  const currentPath = window.location.pathname;

  const isTutor = currentPath.includes('/dashboard/tutordashboard');
  const getIconByActivityType = (activityType) => {
    switch (activityType) {
      case 'documents':
        return <DocIcon />;
      case 'notes':
        return <NoteIcon />;
      case 'payments':
        return <ReceiptIcon />;
      case 'flashcards':
        return <FlashcardIcon />;
      case 'bounty':
        return <BountyChat />;
      case 'quiz':
        return <NoteIcon />;
      default:
        return undefined;
    }
  };

  const getFileIconByActivityType = (activityType) => {
    switch (activityType) {
      case 'documents':
        return <AdobeIcon />;
      case 'notes':
        return <NoteSmIcon />;
      case 'payments':
        return <ReceiptSmIcon />;
      case 'flashcards':
        return <FlashcardSmIcon />;
      case 'bounty':
        return <ReceiptSmIcon />;
      case 'quiz':
        return <ReceiptSmIcon />;
      default:
        return undefined;
    }
  };

  const getTextByActivityType = (feed) => {
    switch (feed.activityType) {
      case 'documents':
        return `You uploaded "${getFileName(feed.link)}" to your workspace`;
      case 'notes':
        return `You created a new note "${getFileName(
          feed.link
        )}" to your workspace`;
      case 'payments':
        return isTutor
          ? `You received a $${feed.payment.amount} payment`
          : `Your $${feed.payment.amount} payment was processed successfully`;
      case 'flashcards':
        return `You created a new flashcard deck "${feed.title}" `;
      case 'quiz':
        return `You created a new quiz "${feed.title}" `;
      case 'bounty':
        return isTutor
          ? `Click here to begin your session`
          : `Click to join your Shepherd for your session`;
      default:
        return undefined;
    }
  };
  const navigateToChat = () => {
    isTutor
      ? navigate('/dashboard/tutordashboard/messages')
      : navigate('/dashboard/messaging');
  };
  useEffect(() => {
    if (feeds?.data) {
      const currentTime = new Date();

      const filterByPeriod = (feed: any) => {
        const feedTime = new Date(feed.updatedAt);
        if (feedPeriod === 'all') {
          return true;
        } else if (feedPeriod === 'today') {
          return isSameDay(currentTime, feedTime);
        } else if (feedPeriod === 'week') {
          return isSameWeek(currentTime, feedTime);
        } else if (feedPeriod === 'month') {
          return isSameMonth(currentTime, feedTime);
        } else {
          return false;
        }
      };
      if (isTutor) {
        setFilteredFeeds(
          feeds?.data
            .filter(
              (feed) =>
                feed.activityType === 'transaction' ||
                feed.activityType === 'bounty'
            )
            .filter(filterByPeriod)
        );
      } else {
        setFilteredFeeds(
          feeds?.data
            .filter((feed) => feed.activityType !== 'contract')
            .filter(filterByPeriod)
        );
      }
    }
  }, [isTutor, feedPeriod, feeds?.data]);

  return (
    <>
      <Box>
        <Flex alignItems="center">
          <HStack mb={2}>
            <Box w={5}>
              {userType === 'Student' ? <FeedIcon /> : <WalletIcon />}
            </Box>

            <Text fontSize={16} fontWeight={500} mx={2}>
              {userType === 'Student' ? 'Activity Feed' : 'Recent Transactions'}
            </Text>
          </HStack>
          <Spacer />

          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<RiCalendar2Fill />}
              rightIcon={<BsChevronDown />}
              variant="outline"
              fontSize={14}
              fontWeight={500}
              color="#5C5F64"
              mb={2}
              h={'32px'}
            >
              {feedPeriod}
            </MenuButton>
            <MenuList minWidth={'auto'}>
              <MenuItem onClick={() => setFeedPeriod('all')}>All</MenuItem>
              <MenuItem onClick={() => setFeedPeriod('today')}>Today</MenuItem>
              <MenuItem onClick={() => setFeedPeriod('week')}>
                This week
              </MenuItem>
              <MenuItem onClick={() => setFeedPeriod('month')}>
                This month
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
        <Divider />
      </Box>

      <Box
        sx={{ maxHeight: '350px', overflowY: 'auto' }}
        className="custom-scroll"
      >
        {filteredFeeds?.length > 0 ? (
          filteredFeeds
            .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
            // .filter((f) => f.link)
            .map((feed: any, index) => (
              <>
                <Root px={3} my={4} key={index}>
                  <Box maxHeight={45} zIndex={1}>
                    {getIconByActivityType(feed.activityType)}
                  </Box>
                  <Stack direction={'column'} px={4} spacing={1}>
                    <Text color="text.300" fontSize={12} mb={0}>
                      <TimeAgo timestamp={feed.updatedAt} />
                    </Text>

                    <Text
                      fontWeight={400}
                      color="text.200"
                      fontSize="14px"
                      mb={0}
                    >
                      {getTextByActivityType(feed)}
                    </Text>

                    <Spacer />

                    <Box
                      width={'fit-content'}
                      height="40px"
                      borderRadius={'30px'}
                      border=" 1px dashed #E2E4E9"
                      justifyContent="center"
                      alignItems="center"
                      px={3}
                      _hover={{ cursor: 'pointer', bgColor: '#dcdfe5' }}
                      onClick={() => {
                        if (feed.activityType === 'bounty') {
                          if (feed.link) {
                            window.open(`${feed.link}`, '_blank');
                          } else {
                            navigateToChat();
                          }
                        } else if (feed.activityType === 'documents') {
                          navigate(`/dashboard/notes/new-note`, {
                            state: {
                              documentUrl: feed.link,
                              docTitle: getFileName(feed.link)
                            }
                          });
                        } else if (feed.activityType === 'quiz') {
                          navigate(
                            `/dashboard/quizzes/take?quiz_id=${feed.quiz}`
                          );
                        } else if (feed.activityType === 'flashcards') {
                          fetchSingleFlashcard(feed.flashcard);
                        } else {
                          navigate(`${feed.link}`);
                        }
                      }}
                    >
                      <Flex mt={2.5} gap={1}>
                        <Text>
                          {getFileIconByActivityType(feed.activityType)}
                        </Text>

                        <Text fontWeight={500} fontSize={12} color="#73777D">
                          {feed.link
                            ? feed.activityType === 'bounty'
                              ? 'New Bounty Started'
                              : getFileName(feed.link)
                            : feed.title}
                        </Text>
                      </Flex>
                    </Box>
                  </Stack>
                </Root>
              </>
            ))
        ) : (
          <Center h="400px">
            <Box textAlign={'center'} px={20} mt={5}>
              <VStack spacing={5}>
                <EmptyFeeds />
                <Text fontSize={13} fontWeight={500} color="text.400">
                  {userType === 'Student'
                    ? 'Get started with our AI tools'
                    : 'No Activity yet'}
                </Text>
                {userType === 'Student' && (
                  <CustomButton
                    buttonText="Ask Shep"
                    w="165px"
                    onClick={activateHelpModal}
                  />
                )}
              </VStack>
            </Box>
          </Center>
        )}
      </Box>
      <HelpModal
        toggleHelpModal={toggleHelpModal}
        setToggleHelpModal={setToggleHelpModal}
      />
    </>
  );
}

export default ActivityFeeds;
