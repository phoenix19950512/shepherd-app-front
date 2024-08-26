import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  feeds: any;
  fetchFeeds: () => Promise<void>;
};

export default create<Store>((set) => ({
  feeds: null,
  fetchFeeds: async () => {
    const response = await ApiService.getActivityFeeds();
    set({ feeds: await response.json() });
  }
}));
