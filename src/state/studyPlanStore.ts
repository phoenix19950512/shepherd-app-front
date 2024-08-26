import ApiService from '../services/ApiService';
import { NoteDetails, SearchQueryParams, Pagination } from '../types';
import { create } from 'zustand';

type StudyPlanStore = {
  studyPlans: any[];
  studyPlanResources: any[];
  studyPlanReport: any;
  studyPlanUpcomingEvent: any[];

  isLoading: boolean;
  pagination: { page: number; limit: number; total: number };
  fetchPlans: (
    page: number,
    limit: number,
    minReadinessScore?: number,
    maxReadinessScore?: number,
    title?: string,
    subject?: string,
    id?: string
  ) => Promise<void>;
  fetchPlanResources: (
    planId: string,
    isSilentRequest?: boolean
  ) => Promise<void>;
  fetchPlanReport: (planId: string) => Promise<void>;
  fetchUpcomingPlanEvent: () => Promise<void>;
  createStudyPlan: (data: any) => Promise<boolean>;
  deleteStudyPlan: (planId: string) => Promise<void>;
};

export default create<StudyPlanStore>((set) => ({
  studyPlans: [],
  studyPlanResources: [],
  studyPlanReport: null,
  studyPlanUpcomingEvent: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, total: 100 },

  fetchPlans: async (
    page: number,
    limit: number,
    minReadinessScore?: number,
    maxReadinessScore?: number,
    title?: string,
    subject?: string,
    id?: string
  ) => {
    set((state) => {
      if (state.studyPlans?.length > 0) {
        return { isLoading: true };
      }
      return { isLoading: false };
    });

    const searchParamApiKey =
      new URLSearchParams(window.location.search).get('apiKey') || null;

    try {
      const apiUrl = ApiService.getStudyPlans(
        page,
        limit,
        minReadinessScore,
        maxReadinessScore,
        title,
        subject,
        id,
        searchParamApiKey
      );

      const response = await apiUrl;
      const { data, meta } = await response.json();

      set({ studyPlans: data, pagination: meta.pagination });
    } catch (error) {
      // console.error('Error fetching study plans:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUpcomingPlanEvent: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getUpcomingStudyPlanEvent();
      const { data } = await response.json();

      set({ studyPlanUpcomingEvent: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlanResources: async (planId: string, isSilentRequest = false) => {
    if (!isSilentRequest) {
      set({ isLoading: true });
    }
    try {
      const searchParamApiKey =
        new URLSearchParams(window.location.search).get('apiKey') || null;
      const response = await ApiService.getStudyPlanResources(
        planId,
        searchParamApiKey
      );
      const { data } = await response.json();

      set({ studyPlanResources: data });
      return data;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchPlanReport: async (planId: string) => {
    set({ isLoading: true });

    try {
      set({ isLoading: true });
      const response = await ApiService.getStudyPlanReport(planId);
      const data = await response.json();

      set({ studyPlanReport: data });
      return data;
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  createStudyPlan: async (data: any) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.createStudyPlan(data);
      if (response.status === 200) {
        const newPlan = await response.json();
        set((state) => ({
          ...state,
          studyPlans: [...state.studyPlans, newPlan]
        }));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  deleteStudyPlan: async (planId: string) => {
    try {
      set({ isLoading: true });

      const response: any = await ApiService.deleteStudyPlan(planId);

      if (response.status === 200) {
        set((state) => ({
          studyPlans: state.studyPlans.filter((plan) => plan._id !== planId)
        }));

        return response;
      } else {
        return response;
      }
    } catch (error) {
      // Handle errors
      return error;
    } finally {
      set({ isLoading: false });
    }
  }
}));
