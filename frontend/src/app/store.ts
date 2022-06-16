import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from "../features/login/LoginSlice"
import navReducer from '../common/components/navbar/NavBarSlice';
export const store = configureStore({
  reducer: {
    login: loginReducer,
    nav: navReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;