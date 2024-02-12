import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  Message,
  ResponseData,
  UserRequest,
} from "../../interfaces/messageInterface";

// const API_URL = "https://13.234.76.77";
const API_URL = "http://localhost:8000";

export const fetchMessage = createAsyncThunk(
  "message/fetchMessage",
  async (userRequest: UserRequest) => {
    try {
      if (userRequest) {
        console.log(userRequest);
        const response = await fetch(`${API_URL}/send-user-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userRequest),
        });
        const data: ResponseData = await response.json();
        console.log(data);
        return data;
      }
    } catch (err) {
      console.log(err);
      return err;
    }
  }
);

interface initialState {
  messages: string[];
  userRequestData: UserRequest | null;
  responseData: ResponseData | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: Error | null;
  messages2: Message[];
}

const initState: initialState = {
  messages: [],
  messages2: [],
  userRequestData: null,
  responseData: null,
  loading: "idle",
  error: null,
};

const messageSlice = createSlice({
  name: "message",
  initialState: initState,
  reducers: {
    addToMessages: (state, action) => {
      // state.messages.push(action.payload);
      //add to message2 when user sends a message
      state.messages2.push({
        text: (action.payload as UserRequest).user_request,
        products: (action.payload as UserRequest)?.products,
        selectedProduct: (action.payload as UserRequest)?.selectedProduct,
      });
    },
    clearMessages: (state) => {
      state.messages = [];
      state.responseData = null;
      //clearing messages2
      state.messages2 = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessage.pending, (state) => {
        state.error = null;
        state.loading = "pending";
      })
      .addCase(fetchMessage.rejected, (state, action) => {
        state.error = action.error as Error;
        state.loading = "failed";
      })
      .addCase(fetchMessage.fulfilled, (state, action) => {
        console.log(action);
        state.error = null;
        state.loading = "succeeded";
        state.responseData = action.payload as ResponseData;
        const r = action.payload as ResponseData;
        state.messages2.push({
          text: (action.payload as ResponseData).responce_data,
          products: (action.payload as ResponseData)?.products?.map((p) => {
            const price = p.price.toString();
            return { ...p, price };
          }),
          selectedProduct: r?.selectedProduct
            ? {
                ...r!.selectedProduct,
                price: r!.selectedProduct!.price.toString(),
              }
            : null,
        });
        //for messages2
      });
  },
});

export const { addToMessages, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
