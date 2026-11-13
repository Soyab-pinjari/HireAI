
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  UserLogin,
  UserLogout
} from "../services/api.js";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await UserLogin(userData);

      console.log("FULL LOGIN RESPONSE:", response);

      const user = response.user || response.data?.user;

      if (!user) {
        return rejectWithValue(
          "Login successful, but user data was not received"
        );
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(user));

      // Save token only if backend returns it
      const token =
        response.token ||
        response.accessToken ||
        response.data?.token;

      if (token) {
        localStorage.setItem("token", token);
      }

      return user;

    } catch (error) {
      console.error("Login API Error:", error.response?.data || error);

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
        state.error = null;
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
      });
  }
});

export const { clearError, clearSession } = authSlice.actions;

export default authSlice.reducer;
