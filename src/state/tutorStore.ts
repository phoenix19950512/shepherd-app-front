import ApiService from '../services/ApiService';
import { Tutor } from '../types';
import { create } from 'zustand';

type Store = {
  tutor: Tutor | null;
  tutorNotifications: [] | null;
  tutorActivityFeed: [] | null;
  fetchTutor: (tutorId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchTutorActivityFeed: () => Promise<void>;
};

export default create<Store>((set) => ({
  tutorNotifications: null,
  tutorActivityFeed: null,
  tutor: null,

  fetchTutor: async (tutorId) => {
    const response = await ApiService.getTutor(tutorId);
    set({ tutor: await response.json() });
  },

  fetchNotifications: async () => {
    const notificationsResponse = await ApiService.getTutorNotifications();
    set({
      tutorNotifications: await notificationsResponse.json()
    });
  },

  fetchTutorActivityFeed: async () => {
    const tutorActivityFeedResponse = await ApiService.getTutorActivityFeed();
    set({
      tutorActivityFeed: await tutorActivityFeedResponse.json()
    });
  }
}));
