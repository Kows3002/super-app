'use client';

import { Provider } from 'react-redux';
import { SkeletonTheme } from 'react-loading-skeleton';
import { store } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SkeletonTheme baseColor="#171717" highlightColor="#2a2a2a" borderRadius={8}>
        {children}
      </SkeletonTheme>
    </Provider>
  );
}
