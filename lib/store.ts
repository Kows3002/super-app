import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

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
}

const STORAGE_KEY = 'superapp-storage';

const initialState: AppState = {
  user: null,
  selectedCategories: [],
  notes: '',
};

function loadState(): AppState {
  if (typeof window === 'undefined') return initialState;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialState;

    const parsed = JSON.parse(stored);
    const state = parsed.state ?? parsed;

    return {
      user: state.user ?? initialState.user,
      selectedCategories: Array.isArray(state.selectedCategories)
        ? state.selectedCategories
        : initialState.selectedCategories,
      notes: typeof state.notes === 'string' ? state.notes : initialState.notes,
    };
  } catch {
    return initialState;
  }
}

const appSlice = createSlice({
  name: 'app',
  initialState: loadState(),
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload;
    },
    setSelectedCategories(state, action: PayloadAction<string[]>) {
      state.selectedCategories = action.payload;
    },
    setNotes(state, action: PayloadAction<string>) {
      state.notes = action.payload;
    },
    reset() {
      return initialState;
    },
  },
});

export const { reset, setNotes, setSelectedCategories, setUser } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

if (typeof window !== 'undefined') {
  store.subscribe(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ state: store.getState().app }));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
