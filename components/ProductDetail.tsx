import React, { useEffect } from "react";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Comments from "./Comments";
import classNames from "classnames";

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

const GET_LIKE = gql`
  query Query($productId: Int!, $userId: String!) {
    likeByProductId(productId: $productId, userId: $userId) {
      hasLiked
    }
  }
`;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const ProductDetail = ({
  title,
  description,
  price,
  image,
  id,
  stockQuantity,
}) => {
  const router = useRouter();
  const {
    data: likeData,
    loading: likeLoading,
    error: likeError,
  } = useQuery(GET_LIKE, {
    variables: { userId: "cleqri2vl0008kgvxdb5t94u9", productId: id },
  });

  console.log(likeData);

  const [hasLiked, setHasLiked] = React.useState(
    likeData?.likeByProductId[0].hasLiked
  );

  const [updateLike, { data, loading, error }] = useMutation(UPDATE_LIKE);
  // Handle checkout
  const handleClick = async (event) => {
    // Get Stripe.js instance

    // Call your backend to create the Checkout Session
    const { sessionId } = await fetch("/api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        title: title,
        price: price,
        image: image,
        description: description,
      }),
    }).then((res) => res.json());
    console.log(sessionId);
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      alert(error.message);
    }
  };

  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-ds md:max-w-4xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0 mt-4">
            <Image
              className="h-48 w-full object-cover md:w96 md:h-auto"
              src={imageUrl}
              alt="Product Image"
              width={300}
              height={300}
            />
          </div>
          <div className="px-8 pt-2 flex flex-col justify-between">
            {/* <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Product
          </div> */}
            <div>
              {" "}
              <a
                href="#"
                className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
              >
                {title}
              </a>
              <p className="mt-2 text-gray-500">{description}</p>
            </div>

            <div className="flex flex-col justify-end">
              <p className="mt-2 text-gray-700 font-bold">Price: ${price}</p>
              {stockQuantity < 1 ? (
                <div className="bg-red-100 text-red-500 rounded-full px-2 py-1 text-xs font-medium  w-24">
                  Out of Stock
                </div>
              ) : (
                <div>
                  {" "}
                  <button
                    className="bg-orange-100 text-orange-600 rounded-full mt-4 px-2 py-1 text-xs font-medium  w-24"
                    onClick={handleClick}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-blue-100 text-blue-600 rounded-full mt-4 mx-2 px-2 py-1 text-xs font-medium  w-24"
                    onClick={handleClick}
                  >
                    Buy Now
                  </button>
                </div>
              )}
              {likeData?.likeByProductId[0].hasLiked ? (
                <div>Liked: true</div>
              ) : (
                <div>Liked: false</div>
              )}
              <div className="mt-4 flex space-x-4 my-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 w-40 h-8 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    updateLike({
                      variables: {
                        productId: id,
                        hasLiked: hasLiked,
                        userId: "cleqri2vl0008kgvxdb5t94u9",
                      },
                    });
                  }}
                >
                  <svg className="inline w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path
                      fill={
                        likeData?.likeByProductId[0].hasLiked ? "pink" : "black"
                      }
                      d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                    />
                  </svg>
                  {likeData?.likeByProductId[0].hasLiked ? "Unlike" : "Like"}
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3  w-40 h-8 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="inline h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>

                  <span className="ml-2">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 text-gray-500 w-full h-60 text-center align-center text-2xl m-2">
        Scrollable Container for Buy more products
      </div>
      <div>
        <Comments prodId={id} />
      </div>
    </>
  );
};

export default ProductDetail;
