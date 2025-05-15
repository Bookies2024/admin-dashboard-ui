import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/auth-slice"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
// import { apiSlice } from "./services/api-slice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] 
};

const rootReducer = combineReducers({
  auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  // reducer: {
  //   auth: authReducer,
  // [apiSlice.reducerPath]: apiSlice.reducer
  // },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
})

export const persistor = persistStore(store);

export type AppDispatchType = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>