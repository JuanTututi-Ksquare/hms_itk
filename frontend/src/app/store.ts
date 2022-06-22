import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import loginReducer from "../features/login/LoginSlice"
import navReducer from '../common/components/navbar/NavBarSlice';
import appointmentsReducer from '../features/appointments/AppointmentsSlice';
import usersReducer from '../features/users/UsersSlice';
export const store = configureStore({
  reducer: {
    login: loginReducer,
    nav: navReducer,
    appointments: appointmentsReducer,
    users: usersReducer,
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