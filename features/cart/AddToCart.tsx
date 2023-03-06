import { useState } from "react";

import { useAppDispatch } from "../../hooks/hooks";
import { addTocart } from "./cartSlice";

import styles from "./Counter.module.css";

export interface TCartItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

function AddToCart({ cartItem }: { cartItem: TCartItem }) {
  const dispatch = useAppDispatch();

  return (
    <div>
      <button
        onClick={() => dispatch(addTocart({ ...cartItem, quantity: 1 }))}
        className="block w-full  h-8 bg-white hover:bg-gray-100 text-teal-500 border-2 border-teal-500 px-1 pb-0 rounded uppercase font-poppins font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="inline w-4 h-4 mb-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>{" "}
        <span className="mb-0 text-xs">Add to cart</span>
      </button>
    </div>
  );
}

export default AddToCart;
