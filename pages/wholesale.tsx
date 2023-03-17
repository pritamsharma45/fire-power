import React, { useEffect } from "react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { GetServerSideProps } from "next";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

const FETCH_WHOLESALE_PRODUCTS = gql`
  query Query {
    wholesaleProducts {
      id
      minQty
      discount
      productId
      product {
        id
        title
        price
        description
        image
        stockQuantity
      }
    }
  }
`;

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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

import styles from "../styles/CartPage.module.css";

export default function Wholesale() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [quantities, setQuantities] = useState(undefined);
  const { data: session, status } = useSession();
  const {
    data: wholesaleData,
    loading: wholesaleLoading,
    error: wholesaleError,
  } = useQuery(FETCH_WHOLESALE_PRODUCTS);

  console.log(wholesaleData);

  useEffect(() => {
    if (wholesaleData) {
      console.log(
        "Wholesale Data inside useeffect",
        wholesaleData.wholesaleProducts
      );
      const initialQuantities = wholesaleData.wholesaleProducts.reduce(
        (obj, item) => ({
          ...obj,
          [item.product.id]: item.minQty,
        }),
        {}
      );
      console.log("Initial Quantities", initialQuantities);
      setQuantities(initialQuantities);
    }
  }, [wholesaleData]);

  // Handle Form validation

  const checkForErrors = () => {
    if (!quantities) return false;
    for (const quantity of Object.values(quantities)) {
      if (quantity < 10) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    setHasError(checkForErrors());
  }, [quantities]);

  const handleQuantityChange = (productId, quantity) => {
    console.log("Qunaity changed", quantity);
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: parseInt(quantity),
    }));

    const gt = wholesaleData?.wholesaleProducts?.reduce((acc, item) => {
      return acc + quantities?.[item.product.id] * item.product.price;
    }, 0);
    setGrandTotal(gt);
  };

  const handleDeleteClick = (productId) => {
    const updatedWholesaleProducts = wholesaleData?.wholesaleProducts.filter(
      ({ product }) => product.id !== productId
    );
    setTotalPrice(getTotalPrice(updatedWholesaleProducts));
  };

  const handleCheckout = async () => {
    // console.log("Checkout clicked", wholesaleData?.wholesaleProducts);
    // console.log("Quantities", quantities);
    const wholeSaleItems = wholesaleData?.wholesaleProducts?.reduce(
      (acc, item) => {
        if (quantities?.[item.product.id] > 0) {
          acc.items.push({
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            description: item.product.description,
            image: item.product.image,
            quantity: quantities?.[item.product.id],
          });
        }
        return acc;
      },
      { items: [] }
    );
    // console.log("WholeSale Items", wholeSaleItems);
    const payloadCart = {
      userId: session?.user?.id,
      line_items: wholeSaleItems.items,
    };
    // console.log("Payload Cart pushed to stripe session", payloadCart);

    // Get Stripe.js instance

    const { sessionId } = await fetch("/api/checkout/sessionWholesale", {
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

  return (
    <>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-4">Xtreme Passion</h1>
          <h1 className="bg-gray-100 rounded-sm font-bold px-4 pt-1  h-8 mt-1">
            {" "}
            Wholesale Purchase<span></span>
          </h1>
        </div>
        <hr />
        <>
          <div className="flex flex-column gap-2 my-2">
            <div className=" w-28 text-center font-bold">Image</div>
            <div className=" w-72  text-left font-bold">Product</div>
            <div className=" w-32 text-center  font-bold">Unit Price</div>
            <div className=" w-20  font-bold">Quantity</div>
            <div className=" w-32  font-bold">Discount</div>
            <div className=" w-32 text-center font-bold">Total Price</div>
            <div className="text-right font-bold"></div>
          </div>
          <hr />
          {wholesaleData?.wholesaleProducts?.map(
            ({ minQty, discount, product }) => (
              <>
                <div className="flex flex-column gap-2 my-2">
                  <div className="w-36 text-center font-bold">
                    <Image
                      src={
                        "https://drive.google.com/uc?export=view&id=" +
                        product.image
                      }
                      height="90"
                      width="65"
                    />
                  </div>
                  <div className="flex-col w-80">
                    <p className="text-xs font-bold text-left w-72">
                      {product.title}
                    </p>
                    <p className="text-xs font-light text-left w-80">
                      {product.description}
                    </p>
                  </div>
                  <p className=" w-32">$ {product.price.toFixed(2)}</p>

                  <div className="w-32 justify-center">
                    <input
                      type="number"
                      className={`w-16 p-1 border ${
                        quantities?.[product.id] < 10
                          ? "border-red-500"
                          : "border-slate-300"
                      } rounded-md`}
                      id={product.id}
                      value={quantities?.[product.id] ?? minQty}
                      min={minQty}
                      onChange={(event) =>
                        handleQuantityChange(product.id, event.target.value)
                      }
                    />
                  </div>
                  <p className=" text-green-700 font-semibold w-32">{discount * 100} %</p>

                  <p className="text-right  w-32">
                    ${" "}
                    {(
                      quantities?.[product.id] *
                      product.price *
                      (1 - discount)
                    ).toFixed(2)}
                  </p>
                  <div className="w-32 ml-4">
                    <button
                      className="flex items-center justify-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      onClick={() => {}}
                    >
                      <FaTrash className=" h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
                {/* <hr /> */}
              </>
            )
          )}
          <h2 className="text-right mr-2">
            <strong>
              Grand Total: ${" "}
              {wholesaleData?.wholesaleProducts
                ?.reduce((acc, item) => {
                  return (
                    acc + quantities?.[item.product.id] * item.product.price*(1-item.discount)
                  );
                }, 0)
                .toFixed(2)}
            </strong>
          </h2>
          <div className="flex justify-between mt-4 mr-2">
            <p className="text-left text-pink-500 font-semibold">* Please enter a quantity greater than or equal to the minimum specified quantity.</p>
            <button
              onClick={handleCheckout}
              disabled={hasError}
              className={`bg-${hasError ? "gray-200" : "blue-100"} text-${
                hasError ? "gray-400" : "blue-600"
              } rounded-full px-2 py-1 text-sm font-bold w-24`}
            >
              Buy Now
            </button>
          </div>
        </>
      </div>
    </>
  );
}
