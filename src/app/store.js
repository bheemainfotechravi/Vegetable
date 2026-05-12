import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import vendorReducer from "../features/vendorSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";           // ✅ add this

import storage from "../api/storage";
import { persistReducer, persistStore } from "redux-persist";

// ✅ Auth persist
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "token"],
};

// ✅ Vendor persist
const vendorPersistConfig = {
  key: "vendor",
  storage,
  whitelist: ["vendor"],
};

// ✅ Product persist
const productPersistConfig = {
  key: "product",
  storage,
  whitelist: ["products"],
};

// ✅ Guest cart persist
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalQty", "totalPrice"],
};

// ✅ Combine reducers
const rootReducer = combineReducers({
  auth:    persistReducer(authPersistConfig, authReducer),
  vendor:  persistReducer(vendorPersistConfig, vendorReducer),
  product: persistReducer(productPersistConfig, productReducer),
  cart:    persistReducer(cartPersistConfig, cartReducer),   // ✅ add this
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