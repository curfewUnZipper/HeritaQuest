import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

// API question interface
interface QuestionFromAPI {
  id: number;
  question_text: string;
  correct_answer: string;
  user_response: string | null;
  options: string[];
}

// UI option structure
export interface AnswerOption {
  answerText: string;
  isCorrect: boolean;
  userResponse: boolean;
}

// UI question structure
export interface Question {
  id: number;
  questionText: string;
  answerOptions: AnswerOption[];
}

interface QuizState {
  questions: Question[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  quizScore: number;
  quizId: number | null;
  userResponses: Record<number, string>; // questionId -> selected option
  error: string | null;
}

const initialState: QuizState = {
  questions: [],
  status: 'idle',
  quizScore: 0,
  quizId: null,
  userResponses: {},
  error: null,
};

// Thunk return type
interface LoadQuizResponse {
  quizId: number;
  quizScore: number;
  questions: Question[];
}

// Load quiz thunk
export const loadQuiz = createAsyncThunk<
  LoadQuizResponse,
  { location: string },
  { rejectValue: string }
>(
  'quiz/loadQuiz',
  async ({ location }, thunkAPI) => {
    try {
      const token = localStorage.getItem('heritaQuestToken');

      const response = await fetch('https://heritaquest-ip4c.onrender.com/ai/generateLocationQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const questions: Question[] = data.questions.map((q: QuestionFromAPI) => ({
        id: q.id,
        questionText: q.question_text,
        answerOptions: q.options.map(option => ({
          answerText: option,
          isCorrect: option === q.correct_answer,
          userResponse: option === q.user_response,
        })),
      }));

      return {
        quizId: data.id,
        quizScore: data.marks,
        questions,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message ?? 'Failed to load quiz');
    }
  }
);

// Final submit types
interface FinalSubmitPayload {
  id: number;
  marks: number;
  response: { [questionId: number]: string };
}

interface FinalSubmitResponse {
  message: string;
}

// Final submission thunk
export const submitFinalQuiz = createAsyncThunk<
  FinalSubmitResponse,
  FinalSubmitPayload,
  { rejectValue: string }
>(
  'quiz/submitFinalQuiz',
  async ({ id, marks, response }, thunkAPI) => {
    try {
      const token = localStorage.getItem('heritaQuestToken');

      const formattedResponse: Record<string, string> = {};
Object.keys(response).forEach((key) => {
  formattedResponse[Number(key)] = (response as Record<string, string>)[key];
});


      console.log("Sending payload:", JSON.stringify({ id, marks, response: formattedResponse }));

      const res = await fetch('https://heritaquest-ip4c.onrender.com/LocationQuiz/updateLocationQuizResponse', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          id,
          marks,
          response: formattedResponse,
        }),
      });

      if (!res.ok) {
        throw new Error('Final submission failed');
      }

      const data = await res.json();
      return { message: data.message };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message ?? 'Failed to submit quiz');
    }
  }
);

// Slice
const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    updateUserResponse(state, action: PayloadAction<{ questionId: number; userResponse: string }>) {
      const { questionId, userResponse } = action.payload;

      // Update responses map
      state.userResponses[questionId] = userResponse;

      // Update UI options
      const question = state.questions.find(q => q.id === questionId);
      if (question) {
        question.answerOptions.forEach(option => {
          option.userResponse = option.answerText === userResponse;
        });
      }
    },
    incrementScore(state) {
      state.quizScore += 1;
    },
    resetQuiz(state) {
      state.quizId = null;
      state.quizScore = 0;
      state.questions = [];
      state.status = 'idle';
      state.userResponses = {};
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuiz.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizId = action.payload.quizId;
        state.quizScore = action.payload.quizScore;
        state.questions = action.payload.questions;

        // Initialize userResponses with empty strings for each question id
        const initialResponses: Record<number, string> = {};
        action.payload.questions.forEach((q) => {
          initialResponses[q.id] = '';
        });
        state.userResponses = initialResponses;
      })
      .addCase(loadQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load quiz questions';
      });
  },
});

export const { incrementScore, resetQuiz, updateUserResponse } = quizSlice.actions;

export default quizSlice.reducer;
