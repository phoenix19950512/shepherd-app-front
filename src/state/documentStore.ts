import ApiService from '../services/ApiService';
import {
  Pagination,
  SearchQueryParams,
  StudentDocument,
  StudentDocumentPayload
} from '../types';
import { create } from 'zustand';

type StudentDocumentStore = {
  studentDocuments: StudentDocument[];
  tags: string[];
  isLoading: boolean;
  pagination: Pagination;
  fetchStudentDocuments: (queryParams?: SearchQueryParams) => Promise<void>;
  saveDocument: (
    document: StudentDocumentPayload,
    returnDocument?: boolean
  ) => Promise<boolean | StudentDocument>;
  deleteStudentDocument: (id: string) => Promise<boolean>;
  storeDocumentTags: (
    docId: string[] | string,
    tags: string[]
  ) => Promise<boolean>;
};

// Function to save state to local storage
const saveState = (state: Partial<StudentDocumentStore>) => {
  const stateToSave = {
    studentDocuments: state.studentDocuments,
    tags: state.tags,
    pagination: state.pagination
  };
  localStorage.setItem('studentDocumentStore', JSON.stringify(stateToSave));
};

// Function to load state from local storage
const loadState = (): Partial<StudentDocumentStore> => {
  const savedState = localStorage.getItem('studentDocumentStore');
  return savedState
    ? JSON.parse(savedState)
    : {
        studentDocuments: [],
        tags: [],
        pagination: { limit: 10, page: 1, count: 100 }
      };
};

export default create<StudentDocumentStore>((set) => ({
  studentDocuments: [],
  tags: [],
  isLoading: false,
  pagination: { limit: 10, page: 1, count: 100 },
  ...loadState(),

  fetchStudentDocuments: async (queryParams: SearchQueryParams = {}) => {
    try {
      set((prev) => {
        if (prev.studentDocuments?.length) {
          return prev;
        }
        return { isLoading: true };
      });
      const response = await ApiService.getStudentDocuments(queryParams);
      const {
        data,
        meta: { pagination, tags }
      } = await response.json();

      set({ studentDocuments: data, pagination, tags: tags.sort() });
      saveState({ studentDocuments: data, pagination, tags: tags.sort() });
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleStudentDocument: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.getStudentDocument(id);
      const data = await response.json();
      set((state) => ({
        ...state,
        studentDocuments: [...state.studentDocuments, data]
      }));
    } catch (error) {
      // Handle error
    } finally {
      set({ isLoading: false });
    }
  },

  saveDocument: async (
    data: StudentDocumentPayload,
    returnDocument = false
  ) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.saveStudentDocument(data);
      if (response.status === 200) {
        const { data: newNote } = await response.json();
        set((state) => {
          saveState({
            ...state,
            studentDocuments: [newNote, ...state.studentDocuments]
          });
          return {
            ...state,
            studentDocuments: [newNote, ...state.studentDocuments]
          };
        });

        if (returnDocument) {
          return newNote;
        }
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteStudentDocument: async (id: string) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.deleteStudentDocument(id);
      if (response.status === 200) {
        set((state) => {
          const updatedDocuments = state.studentDocuments.filter(
            (doc) => !id.split(',').includes(doc._id)
          );
          // Save the updated state to local storage
          saveState({ ...state, studentDocuments: updatedDocuments });
          return { ...state, studentDocuments: updatedDocuments };
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

  storeDocumentTags: async (docIds: string[] | string, tags: string[]) => {
    try {
      set({ isLoading: true });
      const response = await ApiService.storeDocumentTags(docIds, tags); // Assuming this API call exists
      if (response.status === 200) {
        const { data } = await response.json();
        set((state) => {
          const updatedDocuments = state.studentDocuments.map((doc) => {
            if (
              (Array.isArray(docIds) && docIds.includes(doc._id)) ||
              doc._id === docIds
            ) {
              return data.find((d) => d._id === doc._id) || doc;
            }
            return doc;
          });
          const updatedTags = [...new Set([...state.tags, ...tags])].sort();
          // Save the updated state to local storage
          saveState({
            ...state,
            studentDocuments: updatedDocuments,
            tags: updatedTags
          });
          return { studentDocuments: updatedDocuments, tags: updatedTags };
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
