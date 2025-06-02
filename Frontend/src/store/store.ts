import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './quizSlice';
import fillInTheBlanksReducer from './fillSlice';  // import your fill slice reducer

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    fillInTheBlanks: fillInTheBlanksReducer,  // add fillInTheBlanks slice here
    // other reducers
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
