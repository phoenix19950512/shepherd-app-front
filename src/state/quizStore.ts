import { languages } from '../helpers';
import ApiService from '../services/ApiService';
import {
  QuizData,
  Score,
  Study,
  MinimizedStudy,
  QuizQuestion,
  SchedulePayload
} from '../types';
import {
  differenceBy,
  isEmpty,
  isNil,
  merge,
  omit,
  sortedUniq,
  toNumber
} from 'lodash';
import { create } from 'zustand';

type SearchQueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  tags?: string;
  type?: string;
};

type Pagination = {
  page: number;
  limit: number;
  count: number;
};

type Store = {
  handleToggleStartQuizModal: (value: boolean) => void;
  startQuizModal: boolean;
  tags: string[];
  isLoading: boolean;
  pagination: Pagination;
  minimizedStudy?: MinimizedStudy | null | undefined;
  quiz?: QuizData | null;
  quizzes: QuizData[] | null;
  fetchQuizzes: (queryParams?: SearchQueryParams) => Promise<void>;
  loadQuiz: (
    id: string | null,
    currentStudy?: MinimizedStudy,
    cb?: () => void
  ) => void;
  deleteQuiz: (id: string | number) => Promise<boolean>;
  handleIsLoadingQuizzes: (value: boolean) => void;
  storeQuizTags: (
    quizId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
  handleCreateQuiz: (
    quiz: {
      title: string;
      questions: QuizQuestion[];
      tags: string[];
      canEdit?: boolean;
    },
    cb?: (err: any | boolean, res?: any) => void
  ) => void;
  handleUpdateQuiz: (
    quizId: string,
    quiz: {
      title: string;
      questions: QuizQuestion[];
      tags: string[];
      canEdit?: boolean;
    },
    cb?: (err: any | boolean, res?: any) => void
  ) => void;
  handleDeleteQuizQuestion: (
    quizId: number | string,
    questionId: number | string,
    callback?: (err: any | boolean, res?: any) => void
  ) => void;
  scheduleQuiz: (payload: SchedulePayload) => Promise<boolean>;
  //   storeCurrentStudy: (
  //     flashcardId: string,
  //     data: MinimizedStudy
  //   ) => Promise<void>;
  //   createFlashCard: (
  //     data: any,
  //     generatorType?: string
  //   ) => Promise<Response | undefined>;
  //   storeScore: (flashcardId: string, score: Score) => Promise<boolean>;
  //   updateQuestionAttempt: (
  //     flashcardId: string,
  //     questionText: string,
  //     isPassed: boolean
  //   ) => Promise<boolean>;
};

const saveState = (state: Partial<Store>) => {
  const stateToSave = {
    quizzes: state.quizzes,
    tags: state.tags,
    pagination: state.pagination
    // Add other states you want to save
  };
  localStorage.setItem('quizStore', JSON.stringify(stateToSave));
};

// Function to load state from local storage
const loadState = (): Partial<Store> => {
  const savedState = localStorage.getItem('quizStore');
  return savedState
    ? JSON.parse(savedState)
    : {
        quizzes: null,
        tags: [],
        pagination: { limit: 10, page: 1, count: 100 }
        // Set default values for other states
      };
};

export default create<Store>((set) => ({
  startQuizModal: false,
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },
  minimizedStudy: null,
  quizzes: null,
  tags: [],
  ...loadState(),
  storeQuizTags: async (quizIds: string[] | string, tags: string[]) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeQuizTags(quizIds, tags);

      if (toNumber(response.status) === 200) {
        const { data } = await response.json();
        set((state) => {
          const { quizzes } = state;

          const updateQuiz = (flashcardId: string) => {
            const index = quizzes?.findIndex(
              (card) => card._id === flashcardId
            );

            // const record = data.find((d) => d._id === flashcardId);

            if (typeof index !== 'undefined' && index >= 0 && quizzes) {
              quizzes[index] = data;
            }
          };

          if (Array.isArray(quizIds)) {
            quizIds.forEach(updateQuiz);
          } else {
            updateQuiz(quizIds);
          }

          const newState = {
            ...state,
            quizIds,
            tags: sortedUniq([...state.tags, ...tags])
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
  fetchQuizzes: async (queryParams?: {
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const params = queryParams || ({} as SearchQueryParams);
      if (!params.page) params.page = 1;
      if (!params.limit) params.limit = 10;
      set((prev) => {
        if (prev.quizzes?.length) {
          return prev;
        }
        return { isLoading: true };
      });
      const response = await ApiService.getQuizzes(params || {});
      const { data, meta } = await response.json();

      set((prev) => {
        const d: any = {
          quizzes: data,
          pagination: meta?.pagination
        };
        if (isEmpty(prev.tags)) {
          d.tags = sortedUniq(meta?.tags);
        }
        const newState = { ...prev, ...d };
        if (!params.page || params.page === 1) {
          saveState(newState);
        }
        return newState;
      });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  loadQuiz: async (
    id: string | null,
    currentStudy?: MinimizedStudy,
    cb = () => null
  ) => {
    if (isNil(id)) return { quiz: undefined, minimizedStudy: null };
    let quiz = null;
    // let quiz = state.quizzes?.find((card) => card._id === id);
    if (isNil(quiz)) {
      quiz = async () => {
        const result: any = await ApiService.getQuiz(id as string);
        const { data }: { data: QuizData } = await result.json();
        return data;
      };
    }
    quiz = await quiz();
    console.log(quiz);

    const nextState: any = { quiz };
    if (currentStudy) {
      nextState.minimizedStudy = currentStudy;
    }
    if (typeof cb === 'function') {
      cb();
    }

    set(nextState);
  },
  deleteQuiz: async (id: string | number) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteQuiz(id);
      if (response.status === 200) {
        set((state) => {
          const { quizzes } = state;
          const index = quizzes?.findIndex((card) => card._id === id);
          if (index !== undefined && index >= 0 && quizzes) {
            quizzes.splice(index, 1);
          }
          saveState({ ...state, quizzes });
          return { quizzes };
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
  handleToggleStartQuizModal: (value: boolean) => {
    set({ startQuizModal: value });
  },
  handleIsLoadingQuizzes: (value: boolean) => {
    set({ isLoading: value });
  },
  handleCreateQuiz: async (
    { questions, title, tags },
    callback = (err: any | boolean, res?: any) => null
  ) => {
    try {
      const result = await ApiService.createQuiz({
        questions,
        title,
        tags
      });
      if (result?.status > 399) {
        throw new Error('failed to create quiz');
      }
      const { data } = await result.json();
      set({ quiz: data });
      callback && callback(false, data);
    } catch (error) {
      callback && callback(error);
    }
  },
  handleUpdateQuiz: async (
    quizId,
    { questions, title, tags },
    callback = (err: any | boolean, res?: any) => null
  ) => {
    try {
      const result = await ApiService.updateQuiz(quizId, {
        questions,
        title,
        tags
      });

      if (result?.status > 399) {
        throw new Error('failed to update quiz');
      }

      const { data } = await result.json();

      set((state) => {
        // const {q} = data
        const nonUpdatedQuestions = differenceBy(
          state?.quiz?.questions,
          data?.questions,
          '_id'
        );
        const nextState: Partial<typeof state> = {
          quiz: merge(omit({ _id: quizId, ...data }, ['questions']), {
            questions: [...nonUpdatedQuestions, ...data.questions]
          }) as QuizData
        };
        saveState({ ...state, ...nextState });
        return nextState;
      });
      callback && callback(false, data);
    } catch (error) {
      callback && callback(error);
    }
  },
  handleDeleteQuizQuestion: async (
    quizId,
    questionId,
    callback = (err: any | boolean, res?: any) => null
  ) => {
    try {
      const result = await ApiService.deleteQuizQuestion(quizId, questionId);

      if (result?.status > 399) {
        throw new Error('failed to update quiz');
      }

      const { data } = await result.json();

      set((state) => {
        // const {q} = data

        const nextState: Partial<typeof state> = {
          quiz: merge(omit(data, ['questions']), {
            questions: data.questions
          }) as QuizData
        };
        saveState({ ...state, ...nextState });
        return nextState;
      });
      callback && callback(false, data);
    } catch (error) {
      callback && callback(error);
    }
  },
  scheduleQuiz: async (data: SchedulePayload) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.scheduleStudyEvent(data);
      return response.status === 200;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  }
  //   storeCurrentStudy: async (flashcardId, currentStudy: MinimizedStudy) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.storeCurrentStudy(
  //         flashcardId,
  //         currentStudy.data
  //       );
  //       const { data } = await response.json();
  //       set({ flashcards: data.flashcards });
  //     } catch (error) {
  //       // console.log(error)
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },

  //   storeMinimized: (data: MinimizedStudy) => {
  //     set({ minimizedStudy: data });
  //   },

  //   createFlashCard: async (data: any, generatorType?: string) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.createFlashcard(data, generatorType);
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((store) => {
  //           const { flashcards } = store;
  //           flashcards?.push(data);
  //           return { flashcards };
  //         });
  //       }
  //       return response;
  //     } catch (error) {
  //       // console.log(error)
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },
  //   storeScore: async (flashcardId: string, score: Score) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.storeFlashcardScore({
  //         flashcardId,
  //         score
  //       });
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((state) => {
  //           const { flashcards } = state;
  //           const index = flashcards?.findIndex(
  //             (card) => card._id === flashcardId
  //           );
  //           if (index !== undefined && index >= 0 && flashcards) {
  //             flashcards[index] = data;
  //           }
  //           return { flashcards };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   },
  //   updateQuestionAttempt: async (
  //     flashcardId: string,
  //     questionText: string,
  //     isPassed: boolean
  //   ) => {
  //     try {
  //       set({ isLoading: true });
  //       const response = await ApiService.updateQuestionAttempt({
  //         flashcardId,
  //         questionText,
  //         isPassed
  //       });
  //       if (response.status === 200) {
  //         const { data } = await response.json();
  //         set((state) => {
  //           const { flashcards } = state;
  //           const index = flashcards?.findIndex(
  //             (card) => card._id === flashcardId
  //           );
  //           if (index !== undefined && index >= 0 && flashcards) {
  //             flashcards[index] = data;
  //           }
  //           return { flashcards };
  //         });
  //         return true;
  //       }
  //       return false;
  //     } catch (error) {
  //       return false;
  //     } finally {
  //       set({ isLoading: false });
  //     }
  //   }
  // loadQuiz: async (id: string | null, currentStudy?: MinimizedStudy) => {
  //   set((state) => {
  //     if (!id) return { quiz: undefined, minimizedStudy: null };
  //     const flashcard = state.quizzes?.find((card) => card._id === id);
  //     // if (!flashcard) {
  //     //   const response = ApiService.getSingleFlashcard(id);
  //     //   const respJson = await response.json();
  //     //   set({ flashcard: respJson });
  //     // }

  //     const nextState: Partial<typeof state> = { flashcard };
  //     if (currentStudy) {
  //       nextState.minimizedStudy = currentStudy;
  //     }
  //     return nextState;
  //   });
  // },
}));
