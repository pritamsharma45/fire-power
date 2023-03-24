import React, { useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const FETCH_CART = gql`
  query Query($userId: String!) {
    cartByUserId(userId: $userId) {
      id
      items
    }
  }
`;
const DELETE_CART_ITEM = gql`
  mutation Mutation($userId: String!, $productId: Int!) {
    deleteItemFromCart(userId: $userId, productId: $productId) {
      id
    }
  }
`;

const UPDATE_ITEM_IN_CART = gql`
  mutation UpdateItemQuantityInCart(
    $userId: String!
    $productId: Int!
    $quantity: Int!
  ) {
    updateItemQuantityInCart(
      userId: $userId
      productId: $productId
      quantity: $quantity
    ) {
      items
    }
  }
`;
const GET_PROFILE = gql`
  query Query($userId: String!) {
    getProfileByUserId(userId: $userId) {
      id
      firstName
      lastName
      email
      dob_day
      dob_month
      address
      street
      city
      zip
      createdAt
      updatedAt
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
  const { data: session, status } = useSession();
  // Fetch the user's profile from the server
  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useQuery(GET_PROFILE, {
    variables: { userId: session?.user?.id },
  });
  const [deleteCartItem, { data: deleteData, loading: deleteLoading }] =
    useMutation(DELETE_CART_ITEM);
  const [updateItemInCart, { data: updateData, loading: updateLoading }] =
    useMutation(UPDATE_ITEM_IN_CART);

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

  const payloadCart = {
    userId: session?.user?.id,
    line_items: cart,
    userProfile: profileData?.getProfileByUserId,
  };
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

  const handleDelete = async (id) => {
    try {
      const res = await deleteCartItem({
        variables: {
          userId: session?.user?.id,
          productId: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async (id, quantity) => {
    try {
      const res = await updateItemInCart({
        variables: {
          userId: session?.user?.id,
          productId: id,
          quantity: quantity,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (cart === undefined) {
    return (
      <div className={styles.container}>
        <h1>Your Cart is Empty!</h1>
      </div>
    );
  }

  return (
    <div>
      {cart?.length === 0 ? (
        <h1>Your Cart is Empty!</h1>
      ) : (
        <>
          <div className="container mx-auto max-w-5xl my-5 px-5">
            <div className="flex flex-row justify-between">
              <h1 className="text-3xl font-bold mb-4">Xtreme Passion</h1>
            </div>
            <div className="flex flex-column gap-2 my-2">
              <div className=" w-24 text-center font-bold">Image</div>
              <div className=" w-72  text-left font-bold">Product</div>
              <div className=" w-32 text-center  font-bold">Unit Price</div>
              <div className=" w-16  font-bold">Quantity</div>
              <div className=" w-36 text-right font-bold"></div>
              <div className=" w-32 text-center font-bold">Total Price</div>
            </div>
            {cart.map((item) => (
              <>
                <div className="flex flex-column gap-2 my-2">
                  <div className="w-36 text-center">
                    <Image
                      src={
                        "https://drive.google.com/uc?export=view&id=" +
                        item.image
                      }
                      height="90"
                      width="65"
                    />
                  </div>
                  <div className="flex-col w-80">
                    <p className="text-xs font-bold text-left w-72">
                      {item.title}
                    </p>
                    <p className="text-xs font-light text-left w-80">
                      {item.description}
                    </p>
                  </div>
                  <p className=" w-32">$ {item.price}</p>

                  <p>
                    <div className="flex items-center justify-center">
                      <button
                        className="bg-gray-200 text-gray-700 rounded-l px-4 py-2"
                        onClick={() => {
                          dispatch(decrementQuantity(item.id));
                          handleUpdate(item.id, item.quantity - 1);
                        }}
                      >
                        -
                      </button>
                      <div className="bg-gray-100 text-gray-800 px-1 py-2 w-12 text-center">
                        {item.quantity}
                      </div>
                      <button
                        className="bg-gray-200 text-gray-700 rounded-r px-4 py-2"
                        onClick={() => {
                          dispatch(incrementQuantity(item.id));
                          handleUpdate(item.id, item.quantity + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  </p>
                  <div className="w-32">
                    <button
                      className="flex items-center justify-center px-2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={() => {
                        dispatch(removeFromCart(item.id));
                        handleDelete(item.id);
                      }}
                    >
                      <FaTrash className=" h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                  <p className="w-32 text-right mr-32">
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
                className="bg-blue-100 text-blue-600 rounded-full px-2 py-1  text-sm font-bold  w-24"
                onClick={handleCheckout}
              >
                Buy Now
              </button>
            </div>
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
