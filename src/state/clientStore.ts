import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  clients: [] | null;
  schoolStudents: [] | null;
  schoolCourses: [] | null;
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  fetchSchoolTutorStudents: (page?, limit?, planId?) => Promise<void>;
  fetchSchoolCourses: () => Promise<void>;
};

export default create<Store>((set) => ({
  clients: null,
  schoolStudents: null,
  schoolCourses: null,
  isLoading: false,
  pagination: { limit: 20, page: 1, count: 0 },

  fetchClients: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getTutorClients(1, 40);
      const { data } = await response.json();
      set({ clients: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSchoolTutorStudents: async (
    page: number,
    limit: number,
    planId: string
  ) => {
    set({ isLoading: true });

    try {
      const queryParams = planId ? { studyPlanId: planId } : {};
      console.log(planId);

      const response = await ApiService.getSchoolTutorStudents(
        page,
        limit,
        queryParams
      );
      const { data } = await response.json();

      set({ schoolStudents: data });
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSchoolCourses: async () => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getSchoolCourses(1, 40);
      const { data } = await response.json();
      console.log(data);

      set({ schoolCourses: data });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  }
}));
