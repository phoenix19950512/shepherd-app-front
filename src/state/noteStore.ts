import ApiService from '../services/ApiService';
import { NoteDetails, SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type NoteStore = {
  pinnedNotes: NoteDetails[] | null;
  pinnedNotesCount: number;
  notes: NoteDetails[];
  note: NoteDetails | null;
  tags: string[];
  isLoading: boolean;
  pagination: Pagination;
  fetchNotes: (queryParams?: SearchQueryParams) => Promise<void>;
  fetchSingleNote: (id: string) => void;
  createNote: (data: any) => Promise<boolean>;
  updateNote: (id: string, data: any) => Promise<boolean>;
  deleteNote: (id: string) => Promise<boolean>;
  storeNoteTags: (
    noteId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
};

const saveState = (state: Partial<NoteStore>) => {
  const stateToSave = {
    pinnedNotes: state.pinnedNotes,
    pinnedNotesCount: state.pinnedNotesCount,
    notes: state.notes,
    tags: state.tags,
    pagination: state.pagination
  };
  localStorage.setItem('noteStore', JSON.stringify(stateToSave));
};

// Function to load state from local storage
const loadState = (): Partial<NoteStore> => {
  const savedState = localStorage.getItem('noteStore');
  return savedState
    ? JSON.parse(savedState)
    : {
        pinnedNotes: null,
        pinnedNotesCount: 0,
        notes: [],
        tags: [],
        pagination: { limit: 10, page: 1, count: 100 }
      };
};

export default create<NoteStore>((set) => ({
  pinnedNotes: null,
  note: null,
  pinnedNotesCount: 0,
  notes: [],
  tags: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },
  ...loadState(),

  // Fetching all notes
  fetchNotes: async (queryParams: SearchQueryParams = {}) => {
    try {
      set((prev) => {
        if (prev.notes?.length) {
          return prev;
        }
        return { isLoading: true };
      });
      const response = await ApiService.getAllNotes(queryParams);
      const {
        data: {
          data,
          meta: { pagination, tags }
        }
      } = await response.json();

      set((prev) => {
        const nextState = {
          ...prev,
          notes: data,
          pagination: { ...pagination, count: pagination?.total },
          tags: tags.sort()
        };
        if (!queryParams?.page || queryParams.page === 1) {
          saveState(nextState);
        }

        return nextState;
      });
    } catch (error) {
      // Handle error (e.g., log to console)
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetching a single note
  fetchSingleNote: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getNote(id);
      const data = await response.json();
      set((state) => ({
        ...state,
        note: data.data,
        notes: [...state.notes, data]
      }));
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  storeNoteTags: async (noteIds: string[] | string, tags: string[]) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeNotesTags(noteIds, tags); // Assuming this API call exists
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { notes } = state;
          if (Array.isArray(noteIds)) {
            noteIds.forEach((noteId) => {
              const index = notes.findIndex((note) => note._id === noteId);
              const record = data.find((d) => d._id === noteId);
              if (index !== -1) {
                notes[index] = record;
              }
            });
          } else {
            const index = notes.findIndex((note) => note._id === noteIds);
            const record = data.find((d) => d._id === noteIds);
            if (index !== -1) {
              notes[index] = record;
            }
          }
          saveState({ ...state, notes, tags: [...state.tags, ...tags] });
          return { notes, tags: [...state.tags, ...tags].sort() };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Creating a new note
  createNote: async (data: any) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createNote(data);
      if (response.status === 200) {
        const newNote = await response.json();
        set((state) => {
          saveState({ ...state, notes: [...state.notes, newNote] });
          return { ...state, notes: [...state.notes, newNote] };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Updating a note
  updateNote: async (id: string, data: any) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.updateNote(id, data);
      if (response.status === 200) {
        const updatedNote = await response.json();
        set((state) => {
          const nextState = {
            ...state,
            notes: state.notes.map((note) =>
              note._id === id ? updatedNote : note
            )
          };
          saveState(nextState);
          return nextState;
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // Deleting a note
  deleteNote: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteNote(id);
      if (response.status === 200) {
        set((state) => {
          const nextState = {
            ...state,
            notes: state.notes.filter((note) => note._id !== id)
          };
          saveState(nextState);
          return nextState;
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
}));
