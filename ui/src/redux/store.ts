import { configureStore } from "@reduxjs/toolkit";

import rootReducers from "./reducer";

export type RootState = ReturnType<typeof rootReducers>;

const store = configureStore({
  reducer: rootReducers,
});

export default store;
