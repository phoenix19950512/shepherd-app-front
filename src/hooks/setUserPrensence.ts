// useActiveUserPresence.ts
import { firebaseAuth, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  ref,
  onValue,
  off,
  set,
  onDisconnect,
  serverTimestamp
} from 'firebase/database';
import { useEffect, useState } from 'react';

type UserStatus = {
  state: 'online' | 'offline';
  last_changed: number | object;
};

export const useActiveUserPresence = () => {
  const [userId, setUserId] = useState<string | null>(
    firebaseAuth.currentUser?.uid as string
  );

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    if (!userId) return;

    const userStatusDatabaseRef = ref(database, '/status/' + userId);

    const isOfflineForDatabase: UserStatus = {
      state: 'offline',
      last_changed: serverTimestamp()
    };

    const isOnlineForDatabase: UserStatus = {
      state: 'online',
      last_changed: serverTimestamp()
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        set(userStatusDatabaseRef, isOfflineForDatabase);
      } else {
        set(userStatusDatabaseRef, isOnlineForDatabase);
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
      false
    );

    const connectedRef = ref(database, '.info/connected');
    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false || document.hidden) {
        set(userStatusDatabaseRef, isOfflineForDatabase);
        return;
      }

      onDisconnect(userStatusDatabaseRef)
        .set(isOfflineForDatabase)
        .then(() => {
          set(userStatusDatabaseRef, isOnlineForDatabase);
        });
    });

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
        false
      );
      off(userStatusDatabaseRef);
    };
  }, [userId]); // This effect will re-run every time userId changes
};
