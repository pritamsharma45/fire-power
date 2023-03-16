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
      product {
        title
        stockQuantity
        price
        image
        description
        id
      }
    }
  }
`;

import styles from "../styles/CartPage.module.css";

export default function Wholesale() {
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [quantities, setQuantities] = useState(undefined);
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
          [item.product.id]: 0,
        }),
        {}
      );
      console.log("Initial Quantities", initialQuantities);
      setQuantities(initialQuantities);
    }
  }, [wholesaleData]);

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

  // const handleCheckoutClick = () => {
  //   setGrandTotal(totalPrice);
  //   setTotalPrice(0);
  // };

  return (
    <>
      <div className="container mx-auto max-w-5xl my-5 px-5">
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold mb-4">Xtreme Passion</h1>
          <h1 className="bg-gray-100 rounded-sm font-bold px-4 pt-1  h-8 mt-1">
            {" "}
            Wholesale Purchase
          </h1>
        </div>
        <hr />
        <>
          <div className="flex flex-column gap-2 my-2">
            <div className=" w-36 text-center font-bold">Image</div>
            <div className=" w-72  font-bold">Product</div>
            <div className=" w-32 text-center font-bold">Unit Price</div>
            <div className=" w-32 text-center font-bold">Quantity</div>
            <div className=" w-32 text-center font-bold"></div>
            <div className=" w-32 text-center font-bold">Total Price</div>
          </div>
          <hr />
          {wholesaleData?.wholesaleProducts?.map(({ product }) => (
            <>
              <div className={styles.body}>
                <div className={styles.image}>
                  <Image
                    src={
                      "https://drive.google.com/uc?export=view&id=" +
                      product.image
                    }
                    height="90"
                    width="65"
                  />
                </div>
                <div className="flex-col">
                  <p className="text-xs font-bold text-left">{product.title}</p>
                  <p className="text-xs font-light text-left w-80">
                    {product.description}
                  </p>
                </div>
                <p className="ml-10">$ {product.price.toFixed(2)}</p>

                <p>
                  <div className="w-8 justify-center">
                    <input
                      type="number"
                      className="w-16 p-1"
                      id={product.id}
                      value={quantities?.[product.id]}
                      onChange={(event) =>
                        handleQuantityChange(product.id, event.target.value)
                      }
                    />
                  </div>
                </p>
                <div>
                  <button
                    className="flex items-center justify-center px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => {}}
                  >
                    <FaTrash className=" h-4 mr-1" />
                    Delete
                  </button>
                </div>
                <p className="text-right mr-32">
                  $ {(quantities?.[product.id] * product.price).toFixed(2)}
                </p>
              </div>
              {/* <hr /> */}
            </>
          ))}
          <h2 className="text-right mr-32">
            <strong>
              Grand Total: ${" "}
              {wholesaleData?.wholesaleProducts
                ?.reduce((acc, item) => {
                  return (
                    acc + quantities?.[item.product.id] * item.product.price
                  );
                }, 0)
                .toFixed(2)}
            </strong>
          </h2>
          <div className="flex justify-end mt-4 mr-28">
            <button className="bg-blue-100 text-blue-600 rounded-full px-2 py-1  text-sm font-bold  w-24">
              Buy Now
            </button>
          </div>
        </>
      </div>
    </>
  );
}
