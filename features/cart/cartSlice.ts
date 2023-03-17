import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../../store/store";

export interface CounterState {
  items: object[];
}

const initialState: CounterState = {
  items: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,

  reducers: {
    incrementQuantity: (state, action) => {
      console.log("Action Payload in increment quantity", action.payload);
      console.log("State in increment quantity", state.items);
      const item = state.items.find((item) => item.id === action.payload);
      item.quantity++;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item.quantity === 1) {
        const index = state.items.findIndex(
          (item) => item.id === action.payload
        );
        state.splice(index, 1);
      } else {
        item.quantity--;
      }
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload);
      state.items.splice(index, 1);
    },
    addTocart: (state, action: PayloadAction<object>) => {
      console.log("Action Payload in add to cart", action.payload);
      state.items.push(action.payload);
    },
    updateCart: (state, action: PayloadAction<[object]>) => {
      console.log("ActionPaylocad in update cart", action.payload);

      state.items = [...action.payload];
    },
  },
});

export const {
  addTocart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateCart,
} = counterSlice.actions;

export const selectCartItems = (state: AppState) => state.counter.items;

export default counterSlice.reducer;
