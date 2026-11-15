
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  CheckAuth,
  UserLogin,
  UserLogout
} from "../services/api.js";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await UserLogin(userData);

      console.log("LOGIN RESPONSE:", response);

      const user = response.user;

      if (!response.success || !user) {
        return rejectWithValue("User data not received");
      }

      return user;

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);
// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await UserLogout();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await CheckAuth();
      return response.user;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      
  }
});

export const { clearError, clearSession } = authSlice.actions;

export default authSlice.reducer;
