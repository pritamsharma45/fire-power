import React, { useEffect } from "react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { gql, useQuery } from "@apollo/client";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { min } from "cypress/types/lodash";

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

export default function Wholesale() {
  const [products, setProducts] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [quantities, setQuantities] = useState(undefined);

  const { data: session, status } = useSession();
  const {
    data: wholesaleData,
    loading: wholesaleLoading,
    error: wholesaleError,
  } = useQuery(FETCH_WHOLESALE_PRODUCTS);

  const {
    data: profileData,
    loading: profileLoading,
    error: profileError,
  } = useQuery(GET_PROFILE, {
    variables: { userId: session?.user?.id },
  });

  useEffect(() => {
    if (wholesaleData) {
      setProducts(wholesaleData.wholesaleProducts);

      const initialQuantities = products.reduce(
        (obj, item) => ({
          ...obj,
          [item.product.id]: item.minQty,
        }),
        {}
      );
      setQuantities(initialQuantities);
    }
  }, [wholesaleData]);

  // Handle Form validation

  const checkForErrors = () => {
    if (!quantities) return false;
    const initialQuantities = products.reduce(
      (obj, item) => ({
        ...obj,
        [item.product.id]: item.minQty,
      }),
      {}
    );
    for (const [id, quantity] of Object.entries(quantities)) {
      if (quantity < initialQuantities[id]) {
        return true;
      }
    }
    return false;
  };
  useEffect(() => {
    setHasError(checkForErrors());
  }, [quantities]);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: parseInt(quantity),
    }));

    const gt = products.reduce((acc, item) => {
      return acc + quantities?.[item.product.id] * item.product.price;
    }, 0);
  };

  const handleDeleteClick = (productId) => {
    const updatedWholesaleProducts = products.filter(
      ({ product }) => product.id != productId
    );
    setProducts(updatedWholesaleProducts);
  };

  const handleCheckout = async () => {
    const wholeSaleItems = products.reduce(
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

    const payloadCart = {
      userId: session?.user?.id,
      line_items: wholeSaleItems.items,
      userProfile: profileData?.getProfileByUserId,
    };

    // Get Stripe.js instance

    const { sessionId } = await fetch("/api/checkout/sessionWholesale", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadCart),
    }).then((res) => {
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

  if (wholesaleLoading)
    return <div className="font-bold text-center text-2xl m-4">Loading...</div>;
  return (
    <>
      {products?.length === 0 ? (
        <div className="text-center text-2xl font-bold m-4">
          No wholesale products to display! Check again later!
        </div>
      ) : (
        <div className="container mx-auto max-w-5xl my-5 px-5">
          <div className="flex flex-row justify-between">
            <h1 className="font-bold mb-4">Xtreme Passion</h1>
            <h1 className="bg-gray-100 rounded-sm font-bold px-4 pt-1  h-8 mt-1">
              {" "}
              Wholesale Agents<span></span>
            </h1>
          </div>
          <hr />
          {products.map(({ minQty, discount, product }) => (
            <div className="bg-white shadow-lg  overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <img
                  className="w-40 h-40 object-cover"
                  src={
                    "https://drive.google.com/uc?export=view&id=" +
                    product.image
                  }
                  alt="Image"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <h2 className="font-bold text-xl mb-2"> {product.title}</h2>
                <p className="text-gray-700 text-base mb-4">
                  {" "}
                  {product.description}
                </p>
                <div className="flex items-center mb-4">
                  <div>
                    <p className=" w-20">Price</p>
                    <p className=" w-20"> $ {product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="w-20">Qty</p>
                    <p className=" w-20">
                      {" "}
                      <input
                        type="number"
                        className={`w-16 p-0 m-1 border ${
                          quantities?.[product.id] < minQty
                            ? "border-red-500"
                            : "border-slate-300"
                        } rounded-md`}
                        id={product.id}
                        value={quantities?.[product.id] ?? minQty}
                        min={minQty}
                        onChange={(event) =>
                          handleQuantityChange(product.id, event.target.value)
                        }
                        placeholder="Qty"
                      />
                    </p>
                  </div>

                  <div>
                    <p className=" w-20 text-green-700">Discount</p>
                    <p className=" w-20  text-green-700"> {discount * 100} %</p>
                  </div>

                  <div>
                    <p className=" w-20">Total</p>
                    <p className="font-bold w-20" id={product.id}>
                      ${" "}
                      {quantities?.[product.id]
                        ? (
                            quantities?.[product.id] *
                            product.price *
                            (1 - discount)
                          ).toFixed(2)
                        : (minQty * product.price * (1 - discount)).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  onClick={() => handleDeleteClick(product.id)}
                >
                  <FaTrash className=" h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          <h2 className="text-right mr-2">
            <strong>
              Grand Total: ${" "}
              {products
                ?.reduce((acc, item) => {
                  const qty = quantities?.[item.product.id];
                  const itemTotal = qty
                    ? qty * item.product.price * (1 - item.discount)
                    : item.minQty * item.product.price * (1 - item.discount);
                  return acc + itemTotal;
                }, 0)
                .toFixed(2)}
            </strong>
          </h2>
          <div className="flex justify-between mt-4 mr-2">
            <p className="text-left text-pink-500 font-semibold">
              * Please enter a quantity greater than or equal to the minimum
              specified quantity.
            </p>
            <button
              onClick={handleCheckout}
              disabled={hasError}
              className={`bg-${hasError ? "gray-200" : "blue-100"} text-${
                hasError ? "gray-400" : "blue-600"
              } rounded-full px-2 py-1 text-sm font-bold w-32`}
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
