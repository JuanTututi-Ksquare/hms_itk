import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);

const authentication = getAuth(firebaseApp);

interface Login {
  id: string;
  displayName: string;
  email: string;
  token: string;
  role: string;
}

export interface LoginState {
  loggedIn: boolean;
  loginInfo: Login;
  status: "idle" | "loading" | "completed" | "failed";
}

const initialState: LoginState = {
  loggedIn: false,
  loginInfo: {
    id: "",
    displayName: "",
    email: "",
    token: "",
    role: "",
  },
  status: "idle",
};

export const loginWithFirebase = createAsyncThunk(
  "login/userLogin",
  async (data: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(
      authentication,
      data.email,
      data.password
    );
    const { uid, displayName, email } = userCredential.user;
    const tokenAuth = await userCredential.user.getIdTokenResult();
    const role = tokenAuth.claims.role;
    const accessToken = await userCredential.user.getIdToken();
    return { uid, displayName, email, accessToken, role };
  }
);

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logOut: (state) => {
      state.loggedIn = false;
      state.loginInfo = {
        id: "",
        displayName: "",
        email: "",
        token: "",
        role: "",
      };
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginWithFirebase.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(loginWithFirebase.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(loginWithFirebase.fulfilled, (state, action) => {
      state.status = "completed";
      state.loggedIn = true;
      state.loginInfo = {
        id: action.payload.uid,
        displayName: action.payload.displayName!,
        email: action.payload.email!,
        token: action.payload.accessToken!,
        role: action.payload.role as string,
      };
      localStorage.setItem("token", action.payload.accessToken);
    });
  },
});

export const { logOut } = LoginSlice.actions;

export const selectRequestStatus = (state: RootState) => state.login.status;
export const selectLoginStatus = (state: RootState) => state.login.loggedIn;
export const selectLogin = (state: RootState) => state.login.loginInfo;
export default LoginSlice.reducer;
