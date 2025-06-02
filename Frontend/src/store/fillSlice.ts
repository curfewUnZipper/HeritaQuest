import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Question {
  id: string | number;
  questionText: string;
  answerOptions: { answerText: string; isCorrect: boolean }[];
  userResponse?: string | null;
}

interface FillState {
  questions: Question[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  submitMessage: string | null;
  quizScore: number;
}

const initialState: FillState = {
  questions: [],
  status: 'idle',
  error: null,
  submitStatus: 'idle',
  submitMessage: null,
  quizScore: 0,
};

// Thunk for loading questions
export const loadFillInTheBlanks = createAsyncThunk<
  Question[],
  { location: string },
  { rejectValue: string }
>(
  'fillInTheBlanks/load',
  async ({ location }, thunkAPI) => {
    try {
      const token = localStorage.getItem('heritaQuestToken');
      const response = await axios.post(
        'http://192.168.48.175:8080/ai/generate-fill-Quiz',
        { location },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data as Question[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to load questions');
    }
  }
);

// Thunk for submitting score (PUT request)
export const submitScore = createAsyncThunk<
  { message: string; score: number },
  { quizId: number; score: number },
  { rejectValue: string }
>(
  'fillInTheBlanks/submitScore',
  async ({ quizId, score }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      const payload = { id: quizId, marks: score };

      const res = await fetch('http://192.168.48.175:8080/ai/submitFillQuiz', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Score submission failed');
      }

      const data = await res.json();
      return { message: data.message, score };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message || 'Failed to submit score');
    }
  }
);

const fillInTheBlanksSlice = createSlice({
  name: 'fillInTheBlanks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load questions
      .addCase(loadFillInTheBlanks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadFillInTheBlanks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions = action.payload;
      })
      .addCase(loadFillInTheBlanks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load questions';
      })
      // submit score
      .addCase(submitScore.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitMessage = null;
      })
      .addCase(submitScore.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.submitMessage = action.payload.message;
        state.quizScore = action.payload.score;
      })
      .addCase(submitScore.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitMessage = action.payload ?? 'Failed to submit score';
      });
  },
});

export default fillInTheBlanksSlice.reducer;
