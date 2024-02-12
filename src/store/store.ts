import { configureStore } from "@reduxjs/toolkit/react";
import messageReducer from "./slice/messageSlice";

export const store = configureStore({
  reducer: {
    message: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
