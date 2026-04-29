import { getMe, type User } from "@api/users";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await getMe();
      return user;
    } catch {
      return rejectWithValue("Failed to fetch user");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.isInitialized = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
        state.isInitialized = true;
      })

      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isInitialized = true;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
