import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const CREATE_ORDER = gql`
  mutation Mutation(
    $total: Float!
    $items: [OrderItemInput!]!
    $userId: String!
    $payment: PaymentTransactionInput!
  ) {
    createOrder(
      total: $total
      items: $items
      userId: $userId
      payment: $payment
    ) {
      total
    }
  }
`;

const FETCH_CART = gql`
  query Query($userId: String!) {
    cartByUserId(userId: $userId) {
      id
      items
    }
  }
`;
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

import {
  selectCartItems,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  updateCart,
} from "../features/cart/cartSlice";
import styles from "../styles/CartPage.module.css";

export default function Cart({ cartItems }) {
  console.log("Cart items in cart page", cartItems);
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  // Fetch cart form server
  const {
    data: cartFromDB,
    loading: commentsLoading,
    error: commentsError,
  } = useQuery(FETCH_CART, {
    variables: {
      userId: session?.user?.id,
    },
  });

  let cartfromDB = cartFromDB?.cartByUserId?.items;
  console.log("Cart items fetched from DB", cartfromDB);
  useEffect(() => {
    if (cartfromDB !== undefined) {
      dispatch(updateCart(cartfromDB));
    }
  }, [dispatch, cartfromDB]);
  useEffect(() => {
    dispatch(updateCart(cartItems));
  }, [dispatch, cartItems]);

  const getTotalPrice = () => {
    return cart.reduce(
      (accumulator, item) => accumulator + item.quantity * item.price,
      0
    );
  };
  const cart = useSelector(selectCartItems);
  // const cart = cartFromDB?.cartByUserId?.items;
  // console.log("Cart items in cart page", cart);
  const payloadCart = { userId: session?.user?.id, line_items: cart };
  console.log("Cart items in payload", payloadCart);
  const handleCheckout = async () => {
    // Get Stripe.js instance

    const { sessionId } = await fetch("/api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadCart),
    }).then((res) => {
      console.log("Checkout done", JSON.stringify(res));
      return res.json();
    });
    console.log(sessionId);
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      alert(error.message);
    }
  };
  const saveCart = async () => {};

  if (cart === undefined) {
    return (
      <div className={styles.container}>
        <h1>Your Cart is Empty!</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {cart?.length === 0 ? (
        <h1>Your Cart is Empty!</h1>
      ) : (
        <>
          <div className={styles.header}>
            <div>Image</div>
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
            <div></div>
            <div className="text-left mr-10">Total Price</div>
          </div>
          {cart.map((item) => (
            <>
              <div className={styles.body}>
                <div className={styles.image}>
                  <Image
                    src={
                      "https://drive.google.com/uc?export=view&id=" + item.image
                    }
                    height="90"
                    width="65"
                  />
                </div>
                <div className="flex-col">
                  <p className="text-xs font-bold text-left">{item.title}</p>
                  <p className="text-xs font-light text-left w-80">
                    {item.description}
                  </p>
                </div>
                <p className="ml-10">$ {item.price}</p>

                <p>
                  <div className="flex items-center justify-center">
                    <button
                      className="bg-gray-200 text-gray-700 rounded-l px-4 py-2"
                      onClick={() => dispatch(decrementQuantity(item.id))}
                    >
                      -
                    </button>
                    <div className="bg-gray-100 text-gray-800 px-1 py-2 w-12 text-center">
                      {item.quantity}
                    </div>
                    <button
                      className="bg-gray-200 text-gray-700 rounded-r px-4 py-2"
                      onClick={() => dispatch(incrementQuantity(item.id))}
                    >
                      +
                    </button>
                  </div>
                </p>
                <div>
                  <button
                    className="flex items-center justify-center px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    <FaTrash className=" h-4 mr-1" />
                    Delete
                  </button>
                </div>
                <p className="text-right mr-32">
                  $ {(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
              {/* <hr /> */}
            </>
          ))}
          <h2 className="text-right mr-32">
            <strong>Grand Total: $ {getTotalPrice().toFixed(2)}</strong>
          </h2>
          <div className="flex justify-end mt-4 mr-28">
            <button
              className="bg-orange-100 text-orange-600 rounded-full px-2 py-1 mr-3 text-sm font-bold  w-24"
              onClick={saveCart}
            >
              Save Cart
            </button>
            <button
              className="bg-blue-100 text-blue-600 rounded-full px-2 py-1  text-sm font-bold  w-24"
              onClick={handleCheckout}
            >
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { cart } = context.query;
  const cartItems = JSON.parse(cart);
  return {
    props: {
      cartItems,
    },
  };
};
