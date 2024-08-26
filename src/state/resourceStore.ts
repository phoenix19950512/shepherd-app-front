import ApiService from '../services/ApiService';
import { Course, Country, LevelType } from '../types';
import { create } from 'zustand';

type Store = {
  courses: Array<Course>;
  studyPlanCourses: Array<Course>;
  countries: Array<Country>;
  rate: number;
  resourcesLoaded: boolean;
  levels: Array<LevelType>;
  fetchResources: () => Promise<void>;
};

// Function to save state to local storage
const saveState = (state: Partial<Store>) => {
  const stateToSave = {
    courses: state.courses,
    countries: state.countries,
    rate: state.rate,
    resourcesLoaded: state.resourcesLoaded,
    levels: state.levels
  };
  localStorage.setItem('resourceStore', JSON.stringify(stateToSave));
};

// Function to load state from local storage or return default state
const loadState = () => {
  const savedState = localStorage.getItem('resourceStore');
  if (savedState) {
    return JSON.parse(savedState);
  }
  return {
    courses: [],
    studyPlanCourses: [],
    countries: [],
    rate: 0,
    resourcesLoaded: false,
    levels: []
  };
};

const useResourceStore = create<Store>((set) => {
  const initialState = loadState();

  return {
    ...initialState,
    fetchResources: async () => {
      const response = await ApiService.getResources();
      const data = await response.json();
      const countriesResponse = await ApiService.getCountries();
      const countriesData = await countriesResponse.json();
      const countries: Array<Country> = countriesData
        .map((country: any) => ({ name: country.name.common }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      const newState = {
        rate: data.rate,
        courses: data.courses,
        levels: data.levels,
        studyPlanCourses: data.studyPlanCourses,
        countries,
        resourcesLoaded: true
      };

      set(newState);
      saveState(newState);
    }
  };
});

export default useResourceStore;
