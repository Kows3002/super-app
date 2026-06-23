import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  name: string;
  username: string;
  email: string;
  mobile: string;
}

interface AppState {
  user: UserData | null;
  selectedCategories: string[];
  notes: string;
  setUser: (user: UserData) => void;
  setSelectedCategories: (cats: string[]) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      selectedCategories: [],
      notes: '',
      setUser: (user) => set({ user }),
      setSelectedCategories: (cats) => set({ selectedCategories: cats }),
      setNotes: (notes) => set({ notes }),
      reset: () => set({ user: null, selectedCategories: [], notes: '' }),
    }),
    { name: 'superapp-storage' }
  )
);
