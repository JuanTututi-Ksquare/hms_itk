import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface User {
    id: string,
    first_name: string,
    last_name: string,
    birthdate: string,
    is_deleted: boolean,
    createdAt: string,
    updatedAt: string,
    Patient?: {
        id: number,
        id_user: string,
        curp: string,
        nss?: string,
        createdAt: string,
        updatedAt: string
    },
    Doctor?: {
        id: number,
        id_user: string,
        id_area: number,
        license: string,
        availability: boolean,
        createdAt: string,
        updatedAt: string
    }
}

export interface UsersState {
  users: User[];
  status: "idle" | "loading" | "completed" | "failed";
}

const initialState: UsersState = {
  users: [],
  status: "idle",
};

export const getUsers = createAsyncThunk(
  "users/get",
  async (token: string) => {
    const response = await fetch(`http://localhost:3001/admin/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    const users = data.filter((user: { Patient: any; Doctor: any; }) => {
      return (user.Patient || user.Doctor);
    })
    return users;
  }
);

export const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers: (state) => {
      state.users = [];
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(getUsers.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.status = "completed";
      state.users = action.payload;
    });
  },
});

export const { clearUsers } = UsersSlice.actions;
export const selectUsers = (state: RootState) => state.users.users;
export const selectStatus = (state: RootState) => state.users.status;
export default UsersSlice.reducer;
