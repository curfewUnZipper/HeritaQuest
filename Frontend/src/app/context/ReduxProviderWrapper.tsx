'use client';

import { Provider } from 'react-redux';
import { store } from '../../store/store'; // relative path to your store

export function ReduxProviderWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
