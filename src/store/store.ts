import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth-slice"
import { apiSlice } from "./services/api-slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type AppDispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>