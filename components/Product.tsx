import React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useSession } from "next-auth/react";

// import AddToCart from "../features/counter/AddToCart";
import AddToCart from "../features/cart/AddToCart";
import { TCartItem } from "../features/cart/AddToCart";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./product.module.css";

const UPDATE_LIKE = gql`
  mutation AddOrUpdateLike(
    $productId: Int!
    $userId: String!
    $hasLiked: Boolean!
  ) {
    addOrUpdateLike(
      productId: $productId
      userId: $userId
      hasLiked: $hasLiked
    ) {
      hasLiked
    }
  }
`;

const Product = ({
  title,
  description,
  price,
  image,
  id,
  stockQuantity,
  hasLiked,
  userId,
}) => {
  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;

  const cartItem: TCartItem = {
    id: id,
    title: title,
    description: description,
    price: price,
    image: image,
  };

  const [updateLike, { data, loading, error }] = useMutation(UPDATE_LIKE);

  const [isLiked, setHasLiked] = React.useState(hasLiked);

  const handleLikeProduct = async () => {
    try {
      await updateLike({
        variables: {
          productId: id,
          hasLiked: !hasLiked,
          userId: userId,
        },
      });
      setHasLiked(!hasLiked);
      // toast.success("Product liked successfully!");
      toast.success("Like updated successfully!", {
        autoClose: 1000,
      });
    } catch (error) {
      toast.error("Failed to like product.");
    }
  };

  return (
    <Suspense fallback={<h1>Loading persons...</h1>}>
      <div key={id} className="shadow  max-w-md  rounded h-180">
        <div className="bg-white shadow-lg hover:shadow-xl rounded-lg">
          <div
            className="bg-gray-400 h-32 rounded-t-lg p-4 bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: "center",
            }}
          >
            <div className="text-right">
              <button
                className={
                  isLiked
                    ? "text-red-600 bg-yellow-100 hover:text-red-400 hover:fill-green-500 p-1 rounded-full"
                    : "text-gray-300 bg-yellow-100 hover:text-red-600 hover:fill-green-500 p-1 rounded-full"
                }
                onClick={(e) => {
                  e.preventDefault();
                  handleLikeProduct();
                  setHasLiked(!hasLiked);
                }}
              >
                <svg
                  className={`w-5 h-5 ${loading ? "spin" : ""}`}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-start px-2 pt-2">
            <div className="p-2 flex-grow">
              <h1 className="font-medium text-sm font-poppins">{title}</h1>
              <p className="text-gray-500 text-xs font-nunito">{description}</p>
              {stockQuantity < 1 && (
                <div className="bg-red-100 text-red-500 rounded-full px-2 py-1 text-xs font-medium  w-24">
                  Out of Stock
                </div>
              )}
            </div>
            <div className="p-2 text-right">
              {/* If stockeQuantity is greater than 0 then render below component or else render out of stock */}
              {stockQuantity > 0 ? (
                <>
                  <div className="text-teal-500 text-md font-semibold  font-poppins">
                    ${price}
                  </div>
                  <div className="text-xs text-gray-500  line-through font-poppins">
                    $80
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-500 text-md font-semibold  font-poppins">
                    ${price}
                  </div>
                  <div className="text-xs text-gray-500  line-through font-poppins">
                    $80
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center px-2 pb-2">
            <div className="w-1/2 p-1">
              <Link href={`/product/${id}`}>
                <button className="block w-full h-8 bg-teal-500 hover:bg-teal-600 text-white border-2 border-teal-500 hover:border-teal-600 pl-1 pb-1 rounded uppercase font-small">
                  <svg viewBox="0 0 24 24" className="inline w-4 h-4">
                    <path
                      fill="currentColor"
                      d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"
                    />
                  </svg>
                  {"   "}
                  <span className="mb-0 text-xs">Details</span>
                </button>
              </Link>
            </div>
            <div className="w-1/2 p-1">
              <AddToCart cartItem={cartItem} />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Product;
// export default connect(null, { addProduct })(Product)
