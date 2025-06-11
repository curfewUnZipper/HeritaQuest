import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunk to Fetch Full User Data
export const fetchUserFromDB = createAsyncThunk(
  'user/fetchUserDetail',
  async () => {
    // Ensure `localStorage` is accessed in the client-side only
    const token = typeof window !== 'undefined' ? localStorage.getItem("heritaQuestToken") : null;

    try {
      const res = await fetch('https://heritaquest-ip4c.onrender.com/user/fetchUserDetail', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user data');
      const data = await res.json();

      // Save minimal user info to localStorage
      const minimalUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        name: data.name,
        userImageUrl: data.userImageUrl || null,
        public_id: data.public_id || null,
      };
      
      // Set minimal user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("heritaQuestUser", JSON.stringify(minimalUser));
      }

      return data; // Return full user data to be stored in Redux
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

const initialState = {
  id: null,
  username: '',
  email: '',
  name: '',
  userImageUrl: null,
  public_id: null,
  quizzes: [], // You can store quizzes here
  loading: false,
  error: null,
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: () => {
      // Clear localStorage and reset state on logout
      if (typeof window !== 'undefined') {
        localStorage.removeItem("heritaQuestUser");
        localStorage.removeItem("heritaQuestToken");
      }
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFromDB.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFromDB.fulfilled, (state, action) => {
        // Updating only the relevant parts of the state
        state.id = action.payload.id;
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.name = action.payload.name;
        state.userImageUrl = action.payload.userImageUrl;
        state.public_id = action.payload.public_id;
        state.quizzes = action.payload.quizzes || []; // Set quizzes if available
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUserFromDB.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
