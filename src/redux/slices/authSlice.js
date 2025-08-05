import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser, loginUser } from '../api/authApi';

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password }) => {
  const response = await signupUser(name, email, password);
  return response;
});

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const response = await loginUser(email, password);
  return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    authenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { userId: action.payload.userId, email: action.payload.email, name: action.payload.name, role: action.payload.role };
        state.token = action.payload.token;
        state.authenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;