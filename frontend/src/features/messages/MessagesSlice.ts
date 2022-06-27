import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface Message {
  id: number;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessagesState {
  messages: { messages: Message[]; count: 0 };
  status: "idle" | "loading" | "completed" | "failed";
}

const initialState: MessagesState = {
  messages: { messages: [], count: 0 },
  status: "idle",
};

export const getMessages = createAsyncThunk(
  "messages/get",
  async (info: { token: string; page?: number }) => {
    if (info.page) {
      const response = await fetch(
        `http://localhost:3001/contact?` +
          new URLSearchParams({
            page: `${info.page}`,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${info.token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    }
    const response = await fetch(`http://localhost:3001/contact`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${info.token}`,
      },
    });
    const data = await response.json();
    return data;
  }
);

export const MessagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = { messages: [], count: 0 };
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMessages.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(getMessages.rejected, (state) => {
      state.status = "failed";
    });

    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.status = "completed";
      state.messages = action.payload;
    });
  },
});

export const { clearMessages } = MessagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages.messages;
export const selectStatus = (state: RootState) => state.appointments.status;
export default MessagesSlice.reducer;
