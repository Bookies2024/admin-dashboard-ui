import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  stats: {
    totalMembers: 0,
    genderRatio: {},
    ageRatio: {},
    totalSessions: 0
  }
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
    },
    clearStats: (state) => {
      state.stats = {
        totalMembers: 0,
        genderRatio: {},
        ageRatio: {},
        totalSessions: 0
      };
    }
  }
});

export const { setStats, clearStats } = appSlice.actions;
export default appSlice.reducer;

export const selectCurrentStats = (state: RootState) => state.app.stats;