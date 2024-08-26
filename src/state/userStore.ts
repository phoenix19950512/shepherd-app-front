import { fetchStudentDocuments } from '../services/AI';
import ApiService from '../services/ApiService';
import {
  Subscription,
  MobileSubscription,
  User,
  UserNotifications
} from '../types';
import { create } from 'zustand';

type List = {
  name: string;
  fullPath: string;
  customMetadata: {
    ingest_status: 'success' | 'too_large';
  };
};

type Store = {
  user: User | null;
  userNotifications: Array<UserNotifications>;
  hasActiveSubscription: boolean;
  activeSubscription: Subscription | MobileSubscription | null;
  onboardCompleted: boolean;
  fileSizeLimitMB: number;
  fileSizeLimitBytes: number;
  flashcardCountLimit: number;
  quizCountLimit: number;
  fetchUser: () => Promise<boolean>;
  fetchNotifications: () => Promise<void>;
  fetchUserDocuments: (userId: string) => Promise<void>;
  userDocuments: Array<List> | [];
  setUserData: (data: Partial<User>) => void;
  logoutUser: () => void;
};

// Function to save state to local storage
const saveState = (newState: Partial<Store>) => {
  // Retrieve the existing state from local storage
  const existingStateJSON = localStorage.getItem('userStore');
  const existingState = existingStateJSON ? JSON.parse(existingStateJSON) : {};

  // Merge the new state with the existing state
  const updatedState = {
    ...existingState,
    ...newState
  };

  // Save the updated state to local storage
  localStorage.setItem('userStore', JSON.stringify(updatedState));
};

// Function to load state from local storage
const loadState = (): Partial<Store> => {
  const savedState = localStorage.getItem('userStore');
  return savedState
    ? JSON.parse(savedState)
    : {
        user: null,
        userNotifications: [],
        userDocuments: [],
        hasActiveSubscription: false,
        activeSubscription: null,
        onboardCompleted: true,
        fileSizeLimitMB: 0,
        fileSizeLimitBytes: 0,
        flashcardCountLimit: 0,
        quizCountLimit: 0
      };
};

const useUserStore = create<Store>((set, get) => ({
  user: null,
  userNotifications: [],
  userDocuments: [],
  hasActiveSubscription: false,
  activeSubscription: null,
  onboardCompleted: true,
  fileSizeLimitMB: 0,
  fileSizeLimitBytes: 0,
  flashcardCountLimit: 0,
  quizCountLimit: 0,
  ...loadState(),
  fetchUser: async () => {
    const response = await ApiService.getUser();
    if (response.status !== 200) return false;
    const userData = await response.json();

    const hasActiveWebSubscription = !!(
      userData.subscription &&
      (userData.subscription.status === 'active' ||
        userData.subscription.status === 'trialing')
    );

    const hasActiveMobileSubscription = !!(
      userData.mobileSubscription &&
      userData.mobileSubscription.status === 'active'
    );

    const hasActiveSubscription =
      hasActiveWebSubscription || hasActiveMobileSubscription;

    const onboardCompleted = userData.onboardCompleted;

    const activeSubscription = userData.isMobileSubscription
      ? userData.mobileSubscription
      : userData.subscription;

    const fileSizeLimitMB =
      activeSubscription?.subscriptionMetadata?.file_mb_limit || 5;
    const fileSizeLimitBytes = fileSizeLimitMB * 1000000;

    const flashcardCountLimit = hasActiveSubscription
      ? activeSubscription?.subscriptionMetadata?.flashcard_limit || 50000 //premium value, need to run cron on backend not all premium objects have it
      : 40; // Default limit to 40 if on free tier

    const quizCountLimit = hasActiveSubscription
      ? activeSubscription?.subscriptionMetadata?.quiz_limit || 50000 //premium value, need to run cron on backend not all premium objects have it
      : 40;

    const newState = {
      user: userData,
      hasActiveSubscription,
      activeSubscription,
      onboardCompleted,
      fileSizeLimitMB,
      fileSizeLimitBytes,
      flashcardCountLimit,
      quizCountLimit
    };

    set(newState);
    saveState(newState);
    return true;
  },
  logoutUser: () => {
    set({ user: null });
    saveState({ user: null });
  },
  setUserData: (data: Partial<User>) => {
    set((state) => {
      if (state.user) {
        const newUser = { ...state.user, ...data };

        const hasActiveWebSubscription = !!(
          newUser.subscription &&
          (newUser.subscription.status === 'active' ||
            newUser.subscription.status === 'trialing')
        );

        const hasActiveMobileSubscription = !!(
          newUser.mobileSubscription &&
          newUser.mobileSubscription.status === 'active'
        );

        const hasActiveSubscription =
          hasActiveWebSubscription || hasActiveMobileSubscription;

        const onboardCompleted = newUser.onboardCompleted;

        const activeSubscription = newUser.isMobileSubscription
          ? newUser.mobileSubscription
          : newUser.subscription;

        const fileSizeLimitMB =
          activeSubscription?.subscriptionMetadata?.file_mb_limit || 5;
        const fileSizeLimitBytes = fileSizeLimitMB * 1000000;

        const flashcardCountLimit = hasActiveSubscription
          ? activeSubscription?.subscriptionMetadata?.flashcard_limit || 50000 //premium value, need to run cron on backend not all premium objects have it
          : 40; // Default limit to 40 if on free tier

        const quizCountLimit = hasActiveSubscription
          ? activeSubscription?.subscriptionMetadata?.quiz_limit || 50000 //premium value, need to run cron on backend not all premium objects have it
          : 40;

        const updatedState = {
          user: newUser,
          hasActiveSubscription,
          activeSubscription,
          onboardCompleted,
          fileSizeLimitMB,
          fileSizeLimitBytes,
          flashcardCountLimit,
          quizCountLimit
        };

        saveState(updatedState);
        return updatedState;
      }
      return state;
    });
  },
  fetchNotifications: async () => {
    const response = await ApiService.getUserNotifications();
    if (response.status === 200) {
      const notifications = await response.json();
      set({ userNotifications: notifications });
      saveState({ userNotifications: notifications });
    }
  },
  fetchUserDocuments: async (userId: string) => {
    const userDocuments = await fetchStudentDocuments(userId);
    set({ userDocuments });
    saveState({ userDocuments });
  }
}));

export default useUserStore;
