import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import vendorReducer from "../features/vendorSlice";

import storage from "../api/storage"; // ✅ your custom storage
import { persistReducer, persistStore } from "redux-persist";

// ✅ Auth persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "token"],
};

// ✅ Vendor persist config
const vendorPersistConfig = {
  key: "vendor",
  storage,
  whitelist: ["vendor"], // 👈 important
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  vendor: persistReducer(vendorPersistConfig, vendorReducer),
});

// ✅ Store
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

// ✅ Persistor
export const persistor = persistStore(store);