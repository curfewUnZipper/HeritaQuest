import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';
import fillInTheBlanksReducer from './fillSlice'; 
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    fillInTheBlanks: fillInTheBlanksReducer, 
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
