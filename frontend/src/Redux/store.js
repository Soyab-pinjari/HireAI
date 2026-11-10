
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

import {
  persistStore,
  persistReducer
} from "redux-persist";

// Custom localStorage adapter
const storage = {
  getItem: (key) => {
    console.log("Storage getItem:", key);
    return Promise.resolve(localStorage.getItem(key));
  },

  setItem: (key, value) => {
    localStorage.setItem(key, value);
    return Promise.resolve(value);
  },

  removeItem: (key) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  }
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"]
};

const rootReducer = combineReducers({
  auth: authReducer
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE"
        ]
      }
    })
});

// IMPORTANT: First initialize persistor
export const persistor = persistStore(store);

// Then check its status
console.log("Persistor initial:", persistor.getState());

persistor.subscribe(() => {
  console.log("Persistor updated:", persistor.getState());
});
