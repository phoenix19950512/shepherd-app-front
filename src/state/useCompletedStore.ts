import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompletedState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useCompletedStore = create<CompletedState>((set, get) => ({
  open:
    localStorage.getItem('completed') === null
      ? true
      : localStorage.getItem('completed') === 'false',
  setOpen: (open: boolean) => {
    set({ open });
  }
}));

export default useCompletedStore;
