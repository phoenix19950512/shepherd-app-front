import ApiService from '../services/ApiService';
import {
  FlashcardData,
  Score,
  MinimizedStudy,
  SchedulePayload,
  SearchQueryParams,
  Pagination
} from '../types';
import { create } from 'zustand';

type Store = {
  flashcards: FlashcardData[] | null;
  tags: string[];
  cloneFlashcard: (flashcardId: string) => Promise<FlashcardData | null>;
  showStudyList: boolean;
  setShowStudyList: (value: boolean) => void;
  dailyFlashcards: FlashcardData[] | null;
  storeFlashcardTags: (
    flashcardId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
  isLoading: boolean;
  pagination: Pagination;
  minorLoader: boolean;
  fetchFlashcards: (queryParams?: SearchQueryParams) => Promise<void>;
  fetchSingleFlashcard: (id: string) => void;
  fetchSingleFlashcardForAPIKey: (id: string, apiKey: string) => void;
  flashcard?: FlashcardData | null;
  loadFlashcard: (
    id: string | null,
    isDailyStudy: boolean,
    currentStudy?: MinimizedStudy
  ) => void;
  minimizedStudy?: MinimizedStudy | null | undefined;
  storeCurrentStudy: (
    flashcardId: string,
    data: MinimizedStudy
  ) => Promise<void>;
  createFlashCard: (
    data: any,
    generatorType?: string
  ) => Promise<Response | undefined>;
  deleteFlashCard: (id: string) => Promise<boolean>;
  storeScore: (flashcardId: string, score: Score) => Promise<boolean>;
  loadTodaysFlashcards: () => Promise<void>;
  updateQuestionAttempt: (
    flashcardId: string,
    questionText: string,
    isPassed: boolean,
    grade: string
  ) => Promise<boolean>;
  scheduleFlashcard: (
    d: SchedulePayload,
    disableLoader?: boolean,
    type?: 'normal' | 'image-occlusion'
  ) => Promise<boolean>;
  rescheduleFlashcard: (d: any) => Promise<boolean>;
  editFlashcard: (id: string, data: Partial<FlashcardData>) => Promise<boolean>;
};

const saveState = (state: Partial<Store>) => {
  const stateToSave = {
    flashcards: state.flashcards,
    tags: state.tags,
    pagination: state.pagination
    // Add other states you want to save
  };
  localStorage.setItem('flashcardStore', JSON.stringify(stateToSave));
};

// Function to load state from local storage
const loadState = (): Partial<Store> => {
  const savedState = localStorage.getItem('flashcardStore');
  return savedState
    ? JSON.parse(savedState)
    : {
        flashcards: null,
        tags: [],
        pagination: { limit: 10, page: 1, count: 100 }
        // Set default values for other states
      };
};

export default create<Store>((set) => ({
  flashcards: null,
  isLoading: false,
  minorLoader: false,
  tags: [],
  minimizedStudy: null,
  pagination: { limit: 10, page: 1, count: 100 },
  showStudyList: false,
  ...loadState(),
  setShowStudyList: (value: boolean) => {
    set({ showStudyList: value });
  },
  dailyFlashcards: null,
  storeFlashcardTags: async (
    flashcardIds: string[] | string,
    tags: string[]
  ) => {
    try {
      set({ isLoading: true });
      // if (Array.isArray(flashcardIds) && flashcardIds.length === 1) {
      //   flashcardIds = flashcardIds[0];
      // }
      const response = await ApiService.storeFlashcardTags(flashcardIds, tags);
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;

          const updateFlashcard = (flashcardId: string) => {
            const index = flashcards?.findIndex(
              (card) => card._id === flashcardId
            );
            const record = data.find((d) => d._id === flashcardId);

            if (
              typeof index !== 'undefined' &&
              index >= 0 &&
              record &&
              flashcards
            ) {
              flashcards[index] = record;
            }
          };

          if (Array.isArray(flashcardIds)) {
            flashcardIds.forEach(updateFlashcard);
          } else {
            updateFlashcard(flashcardIds);
          }

          const newState = {
            flashcards,
            tags: [...state.tags, ...tags].sort()
          };
          saveState(newState);
          return newState;
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
  async cloneFlashcard(flashcardId) {
    set({ isLoading: true });
    const f = await ApiService.createFlashcard({}, 'manual', flashcardId);
    if (f.status === 200) {
      const d: { data: FlashcardData } = await f.json();
      set({ isLoading: false, flashcard: null });
      return d.data;
    } else {
      set({ isLoading: false });
      return null;
    }
  },
  loadTodaysFlashcards: async () => {
    const response = await ApiService.getTodaysFlashcards();
    const { data } = await response.json();
    set({ dailyFlashcards: data });
  },
  editFlashcard: async (id: string, data: Partial<FlashcardData>) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.editFlashcard(id, data);
      if (response.status === 200) {
        const updatedFlashcard = await response.json();
        set((state) => {
          const flashcards = state.flashcards?.map((flashcard) =>
            flashcard._id === id
              ? { ...flashcard, ...updatedFlashcard }
              : flashcard
          );
          saveState({ ...state, flashcards });
          return { flashcards };
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
  storeCurrentStudy: async (flashcardId, currentStudy: MinimizedStudy) => {
    try {
      // set({ isLoading: true });
      const response = await ApiService.storeCurrentStudy(
        flashcardId,
        currentStudy.data
      );
      const { data } = await response.json();
      set((state) => {
        saveState({ ...state, flashcards: data.flashcards });
        return { flashcards: data.flashcards };
      });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFlashcards: async (queryParams?: SearchQueryParams) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set((prev) => {
        if (prev.flashcards?.length) {
          return prev;
        }
        return { isLoading: true };
      });
      const response = await ApiService.getFlashcards(params || {});
      const { data, meta } = await response.json();

      set((prev) => {
        const d: any = {
          flashcards: data,
          pagination: meta?.pagination
        };
        if (!prev.tags.length) {
          d.tags = meta?.tags.sort();
        }
        if (!queryParams?.page || queryParams?.page === 1) {
          saveState({ ...prev, ...d });
        }
        return { ...d };
      });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSingleFlashcard: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getSingleFlashcard(id);
      const { data } = await response.json();
      set({ flashcard: data });
    } catch (error) {
      //
    } finally {
      set({ isLoading: false });
    }
  },
  fetchSingleFlashcardForAPIKey: async (id: string, apiKey: string) => {
    try {
      const response = await ApiService.getSingleFlashcardForAPIKey(id, apiKey);
      const { data } = await response.json();
      set({ flashcard: data });
    } catch (error) {
      //
    } finally {
      set({ isLoading: false });
    }
  },
  storeMinimized: (data: MinimizedStudy) => {
    set({ minimizedStudy: data });
  },
  loadFlashcard: async (
    id: string | null,
    isDailyStudy = false,
    currentStudy?: MinimizedStudy
  ) => {
    set((state) => {
      if (!id) return { flashcard: undefined, minimizedStudy: null };

      if (isDailyStudy) {
        const flashcard = state.dailyFlashcards?.find(
          (card) => card._id === id
        );
        return { flashcard, showStudyList: false };
      }
      const flashcard = state.flashcards?.find((card) => card._id === id);
      // if (!flashcard) {
      //   const response = ApiService.getSingleFlashcard(id);
      //   const respJson = await response.json();
      //   set({ flashcard: respJson });
      // }

      const nextState: Partial<typeof state> = { flashcard };
      if (currentStudy) {
        nextState.minimizedStudy = currentStudy;
      }

      return nextState;
    });
  },
  scheduleFlashcard: async (
    data: SchedulePayload,
    disableLoader?: boolean,
    type: 'normal' | 'image-occlusion' = 'normal'
  ) => {
    try {
      if (!disableLoader) {
        set({ isLoading: true });
      }
      if (type === 'normal') {
        const response = await ApiService.scheduleStudyEvent(data);
        return response.status === 200;
      } else {
        const response = await ApiService.scheduleImageOcclusionStudyEvent(
          data
        );
        return response.status === 200;
      }
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  rescheduleFlashcard: async (data: any) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.rescheduleStudyEvent(data);
      return response.status === 200;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteFlashCard: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteFlashcard(id);
      if (response.status === 200) {
        set((state) => {
          const { flashcards } = state;
          const ids = id.split(',');
          ids.forEach((idString) => {
            const index = flashcards?.findIndex(
              (card) => card._id === idString
            );
            if (index !== undefined && index >= 0 && flashcards) {
              flashcards.splice(index, 1);
            }
          });
          saveState({ ...state, flashcards });
          return { flashcards };
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
  createFlashCard: async (data: any, generatorType?: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createFlashcard(data, generatorType);
      if (response.status === 200) {
        const { data } = await response.json();
        set((store) => {
          const { flashcards } = store;
          let flashcardData: any = [];
          if (flashcards) {
            flashcardData = flashcards;
          }
          flashcardData.push(data);
          const newState = { ...store, flashcards: flashcardData };
          saveState(newState);
          return newState;
        });
      }
      return response;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  storeScore: async (flashcardId: string, score: Score) => {
    try {
      // set({ isLoading: true });
      const response = await ApiService.storeFlashcardScore({
        flashcardId,
        score
      });
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex(
            (card) => card._id === flashcardId
          );
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards[index] = data;
          }
          const newState = { ...state, flashcards };
          saveState(newState);
          return newState;
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
  updateQuestionAttempt: async (
    flashcardId: string,
    questionText: string,
    isPassed: boolean,
    grade?: string
  ) => {
    try {
      set({ minorLoader: true });
      const response = await ApiService.updateQuestionAttempt({
        flashcardId,
        questionText,
        isPassed,
        grade
      });
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const { flashcards } = state;
          const index = flashcards?.findIndex(
            (card) => card._id === flashcardId
          );
          if (index !== undefined && index >= 0 && flashcards) {
            flashcards[index] = data;
          }
          return { flashcards };
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ minorLoader: false });
    }
  }
}));
