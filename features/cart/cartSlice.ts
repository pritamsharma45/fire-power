import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "../../store/store";

export interface CounterState {
  value: number;
  status: "idle" | "loading" | "failed";
  items: object[];
}

const initialState: CounterState = {
  value: 0,
  status: "idle",
  items: [],
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    increment: (state) => {
    
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
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
  increment,
  decrement,
  incrementByAmount,
  addTocart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateCart,
} = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCount = (state: AppState) => state.counter.value;
export const selectCartItems = (state: AppState) => state.counter.items;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };

export default counterSlice.reducer;
