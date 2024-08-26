import { database } from '../../../firebase';
import firebase from 'firebase/app';
import {
  ref,
  onValue,
  off,
  DataSnapshot,
  update,
  DatabaseReference
} from 'firebase/database';
import { useEffect, useState, useCallback } from 'react';

type OfferAttributes = Record<'offerId', unknown>;
type BountyAttributes = Record<'bountyId', unknown>;
type FlashcardAttributes = Record<'flashcardId', unknown>;
type Attributes = OfferAttributes | BountyAttributes | FlashcardAttributes;
export interface UserNotification {
  user: string;
  text: string;
  type: string;
  attributes?: Attributes;
  readAt?: Date;
  status: 'unviewed' | 'viewed';
  id?: string;
}
function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [hasUnreadNotification, setHasUnreadNotification] =
    useState<boolean>(false);

  useEffect(() => {
    const userNotificationsRef: DatabaseReference = ref(
      database,
      `notifications/${userId}`
    );

    const handleNewNotification = (snapshot: DataSnapshot) => {
      const rawData = snapshot.val() || {};
      const notificationsArray: UserNotification[] = Object.keys(rawData).map(
        (key) => {
          try {
            const notification = JSON.parse(rawData[key]);
            return {
              ...notification,
              id: key
            };
          } catch (error) {
            return null; // Handle parsing errors gracefully, e.g., by skipping the notification
          }
        }
      );

      // Filter out null values (parsing errors)
      const validNotifications = notificationsArray.filter(
        (notification) => notification !== null
      );

      const unreadNotifications = validNotifications.filter(
        (notification) => notification.status === 'unviewed'
      );

      setHasUnreadNotification(unreadNotifications.length > 0);
      setNotifications(validNotifications);
    };
    const unsubscribe = onValue(
      userNotificationsRef,
      handleNewNotification,
      (error) => {
        // console.error('Firebase error:', error);
      }
    );

    // Clean up the Firebase listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [userId]);

  const markAsRead = useCallback(
    (notificationId: string) => {
      const notificationRef = ref(
        database,
        `notifications/${userId}/${notificationId}`
      );
      update(notificationRef, {
        status: 'viewed',
        readAt: new Date().toISOString()
      });
    },
    [userId]
  );

  const markAllAsRead = useCallback(() => {
    const updates: { [key: string]: any } = {};
    notifications.forEach((notification) => {
      if (notification.status === 'unviewed' && notification.id) {
        updates[`notifications/${userId}/${notification.id}`] = JSON.stringify({
          ...notification,
          status: 'viewed',
          readAt: new Date().toISOString()
        });
      }
    });
    update(ref(database), updates);
  }, [userId, notifications]);

  return {
    notifications,
    hasUnreadNotification,
    markAsRead,
    markAllAsRead
  };
}

export default useNotifications;
