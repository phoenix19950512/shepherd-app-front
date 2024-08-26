import ApiService from '../services/ApiService';
import { create } from 'zustand';

type Store = {
  offers: [] | null;
  bounties: [] | any;
  isLoading: boolean;
  fetchOffers: (page: number, limit: number, userType: string) => Promise<void>;
  fetchBountyOffers: (
    page: number,
    limit: number,
    userType: string
  ) => Promise<void>;
  createBounty: (bountyOffer: any) => Promise<boolean>;

  pagination: { page: number; limit: number; total: number };

  offer?: any | null;
  //fechOffer: (id: string | number) => void;

  //acceptOffer: (id: string | number) => void;
  //declineOffer: (id: string | number) => Promise<boolean>;
};

export default create<Store>((set) => ({
  offers: null,
  bounties: null,
  isLoading: false,
  pagination: { page: 0, limit: 0, total: 0 },
  fetchOffers: async (page: number, limit: number, userType: string) => {
    set((prev) => {
      return { isLoading: prev.offers === null };
    });
    try {
      const response = await ApiService.getOffers(page, limit, userType);
      const { data } = await response.json();

      set({ offers: data.data, pagination: data.meta.pagination });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  fetchBountyOffers: async (page: number, limit: number, userType: string) => {
    set({ isLoading: true });
    try {
      set({ isLoading: true });
      const response = await ApiService.getBountyOffers(page, limit, userType);
      const { data, meta } = await response.json();

      set({ bounties: data, pagination: meta.pagination });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  saveBounty: async (data: any) => {
    try {
      set((prev) => {
        if (prev.bounties) {
          prev.bounties.push(data);
        } else {
          prev.bounties = [data];
        }
        return prev;
      });
    } catch (error) {
      // console.log(error)
    } finally {
      set({ isLoading: false });
    }
  },
  createBounty: async (bountyOffer: any): Promise<boolean> => {
    try {
      const response = await ApiService.createBounty(bountyOffer);
      if (response.status !== 200) return false;
      const { data } = await response.json();
      set((prev) => {
        if (prev.bounties) {
          prev.bounties.push(data);
        } else {
          prev.bounties = [data];
        }
        return prev;
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      // set({ isLoading: false });
    }
  }

  // fetchOffer: (id: string | number) => {
  //   set((state) => {
  //     if (!id) return { offer: undefined };
  //     const offer = state.offers?.find((offer) => offer._id === id);
  //     return {offer}
  //   })
  // },

  // acceptOffer: async (id: string | number) => {
  //   try {
  //     set({ isLoading: true });
  //     const response = await ApiService.acceptOffer(id);

  //     if (response.status === 200) {
  //       set((state) => {
  //         const { offers } = state;
  //         const index = offers?.findIndex((card) => card?._id === id);
  //         if (index !== undefined && index >= 0 && offers) {
  //           offers.splice(index, 1);
  //         }
  //         return { offers };
  //       });
  //       return true;
  //     }
  //   } catch (error) {
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  // declineOffer: async (id: string | number) => {
  //   try {
  //     set({ isLoading: true });
  //     const response = await ApiService.declineOffer(id);
  //     if (response.status === 200) {
  //       set((state) => {
  //         const { offers } = state;
  //         const index = offers?.findIndex((card) => card._id === id);
  //         if (index !== undefined && index >= 0 && offers) {
  //           offers.splice(index, 1);
  //         }
  //         return { offers };
  //       });
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
}));
