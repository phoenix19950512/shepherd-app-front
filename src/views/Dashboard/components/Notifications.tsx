import MessageIcon from '../../../assets/message.svg';
import OfferIcon from '../../../assets/offer.svg';
import ReadIcon from '../../../assets/read.svg';
import UnreadIcon from '../../../assets/unread.svg';
import VideoIcon from '../../../assets/video.svg';
import { database } from '../../../firebase';
import userStore from '../../../state/userStore';
import { TimeAgo } from './TimeAgo';
import useNotifications from './useNotification';
import {
  Badge,
  Box,
  Flex,
  Spacer,
  Text,
  Divider,
  Image,
  Stack
} from '@chakra-ui/react';
import { ref, onValue, DataSnapshot, off } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import flashcardStore from '../../../state/flashcardStore';
import { MdMarkAsUnread } from 'react-icons/md';

// import OfferIcon from 'svgs/text-document.svg';

function Notifications(props) {
  const { data, handleRead, handleAllRead } = props;
  const { user } = userStore();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  // const parsedNotifications = data.map((item) => item.notification);

  const { fetchSingleFlashcard } = flashcardStore();
  const isTutor = currentPath.includes('/dashboard/tutordashboard');

  const isWithinAWeek = (createdAt) => {
    const aWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return new Date(createdAt) >= new Date(aWeekAgo);
  };
  const filteredData = data
    .filter((item) => {
      if (isTutor) {
        const allowedTypes = [
          'new_offer_received',
          'upcoming_class',
          'BOUNTY_ACCEPTED',
          'BOUNTY_BID_ACCEPTED',
          'STUDY_PLAN_FOR_FLASHCARD_CREATED',
          'QUIZ_FOR_STUDY_PLAN_CREATED'
        ];
        return (
          allowedTypes.includes(item.type) && isWithinAWeek(item.createdAt)
        );
      } else {
        const allowedTypes = [
          'new_offer_created',
          'offer_accepted',
          'offer_rejected',
          'upcoming_class',
          'BOUNTY_BID_RECIEVED',
          'BOUNTY_CREATED',
          'STUDY_PLAN_FOR_FLASHCARD_CREATED',
          'UPCOMING_FLASHCARD_STUDY'
        ];
        return (
          allowedTypes.includes(item.type) && isWithinAWeek(item.createdAt)
        );
      }
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const Divide = styled(Divider)`
    &:last-child {
      display: none;
    }
  `;
  const getIconByANotificationType = (NotificationType) => {
    switch (NotificationType) {
      case 'note_created':
        return <MessageIcon />;
      case 'new_offer_created':
        return <OfferIcon />;
      case 'new_offer_received':
        return <OfferIcon />;
      case 'offer_accepted':
        return <OfferIcon />;
      case 'offer_rejected':
        return <OfferIcon />;
      case 'upcoming_class':
        return <VideoIcon />;
      case 'BOUNTY_CREATED':
        return <OfferIcon />;
      case 'BOUNTY_ACCEPTED':
        return <OfferIcon />;
      case 'BOUNTY_BID_ACCEPTED':
        return <OfferIcon />;
      case 'BOUNTY_BID_RECIEVED':
        return <OfferIcon />;
      case 'BOUNTY_BID_REJECTED':
        return <OfferIcon />;
      case 'STUDY_PLAN_FOR_FLASHCARD_CREATED':
        return <OfferIcon />;
      case 'QUIZ_FOR_STUDY_PLAN_CREATED':
        return <OfferIcon />;
      case 'UPCOMING_FLASHCARD_STUDY':
        return <OfferIcon />;
      default:
        return <OfferIcon />;
    }
  };
  const getTextByNotificationType = (NotificationType, attributes) => {
    switch (NotificationType) {
      case 'note_created':
        return 'New note created';
      case 'new_offer_created':
        return 'Your offer has been sent ';
      case 'new_offer_received':
        return 'You have received an offer  ';
      case 'offer_accepted':
        return 'Your Offer has been accepted';
      case 'offer_rejected':
        return 'Your Offer has been rejected';
      case 'upcoming_class':
        return 'Your [course] lesson session with [tutor] started';
      case 'BOUNTY_CREATED':
        return 'Your Bounty has been placed';
      case 'BOUNTY_ACCEPTED':
        return 'Bounty Offer accepted';
      case 'BOUNTY_BID_ACCEPTED':
        return 'Bounty bid accepted';
      case 'BOUNTY_BID_RECIEVED':
        return 'Bounty bid received';
      case 'BOUNTY_BID_REJECTED':
        return 'Bounty bid rejected';
      case 'STUDY_PLAN_FOR_FLASHCARD_CREATED':
        return `Your "${
          attributes.topic ? attributes.topic : attributes.deckname
        }" ${
          attributes.quizId ? 'quiz' : 'flashcards'
        }  and 5 others were created successfully`;
      case 'QUIZ_FOR_STUDY_PLAN_CREATED':
        return `Your "${
          attributes.topic ? attributes.topic : attributes.deckname
        }" ${
          attributes.quizId ? 'quiz' : 'flashcards'
        }  and 5 others were created successfully`;
      case 'UPCOMING_FLASHCARD_STUDY':
        return 'You have an upcoming Flashcard study ';
      default:
        return 'You have received a notification';
    }
  };

  const userId = user?._id || '';
  const { notifications, hasUnreadNotification } = useNotifications(userId);

  return (
    <>
      <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Flex>
          <Text
            fontSize={10}
            fontWeight={500}
            color="text.400"
            textTransform={'uppercase'}
          >
            notifications
            <Badge bgColor="#EBF4FE" color="#207df7" fontSize={10}>
              <Text>{filteredData ? filteredData.length : ''}</Text>
            </Badge>
          </Text>
          <Spacer />{' '}
          <Text
            fontSize={10}
            fontWeight={500}
            color="#207df7"
            onClick={handleAllRead}
            cursor="pointer"
          >
            Mark all as read{' '}
          </Text>
        </Flex>

        {data &&
          filteredData.map((i) => (
            <>
              <Box
                className={`notification-item ${i.read ? 'read' : ''}`}
                key={i._id}
                _hover={{ cursor: 'pointer', bg: '#EDF2F7', borderRadius: 8 }}
                onClick={() => {
                  if (i.attributes.offerId) {
                    const url = isTutor
                      ? `/dashboard/tutordashboard/offer/${i.attributes.offerId}`
                      : `/dashboard/offer/${i.attributes.offerId}`;
                    navigate(url);
                  } else if (i.attributes.flashcardId) {
                    fetchSingleFlashcard(i.attributes.flashcardId);
                  }
                }}
              >
                <Flex
                  alignItems="flex-start"
                  px={3}
                  direction={'row'}
                  my={1}
                  py={2}
                  key={i._id}
                  position="relative"
                >
                  <Box maxHeight={45} zIndex={1}>
                    {getIconByANotificationType(i.type)}
                  </Box>
                  <Stack direction={'column'} px={4} spacing={1}>
                    <Text color="text.300" fontSize={12} mb={0}>
                      {<TimeAgo timestamp={i.createdAt} />}
                    </Text>
                    <Text
                      fontWeight={400}
                      color="text.200"
                      fontSize="14px"
                      mb={0}
                    >
                      {getTextByNotificationType(i.type, i.attributes)}
                    </Text>

                    <Spacer />
                  </Stack>
                  <Box
                    maxHeight={45}
                    zIndex={1}
                    position="absolute"
                    right={3}
                    top={5}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRead(i._id);
                    }}
                  >
                    {i.status === 'unviewed' ? <ReadIcon /> : <UnreadIcon />}
                  </Box>
                </Flex>
              </Box>

              <Divide />
            </>
          ))}
      </Box>
    </>
  );
}

export default Notifications;
