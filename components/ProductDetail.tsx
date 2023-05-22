import React, { useEffect, useState } from "react";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import Comments from "./Comments";
import ShareButtons from "./ShareButton";
import ProductSimple from "./ProductSimple";
import { TCartItem } from "../features/cart/AddToCart";
import { useSession } from "next-auth/react";
import { useAppDispatch } from "../hooks/hooks";
import { addTocart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const ADD_TO_CART = gql`
  mutation Mutation($userId: String!, $items: Json!) {
    addItemsToCart(userId: $userId, items: $items) {
      id
    }
  }
`;

const FETCH_TOP_LIKED_PRODUCTS = gql`
  query Query {
    topProducts {
      title
      description
      price
      image
      id
      stockQuantity
    }
  }
`;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const ProductDetail = ({
  title,
  description,
  allergies,
  policyType,
  price,
  image,
  id,
  stockQuantity,
  isLiked,
  inCart,
}) => {
  const cartItem: TCartItem = {
    id: id,
    title: title,
    description: description,
    price: price,
    image: image,
  };
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    data: likeData,
    loading: likeLoading,
    error: likeError,
  } = useQuery(GET_LIKE, {
    variables: { userId: session?.user?.id, productId: id },
  });

  //   Query Top Liked Products
  const {
    data: topLikedProducts,
    loading: topLikedProductsLoading,
    error: topLikedProductsError,
  } = useQuery(FETCH_TOP_LIKED_PRODUCTS);

  console.log("Top Liked Products", topLikedProducts);
  const [blLiked, setHasLiked] = React.useState(isLiked);

  const [updateLike, { data, loading, error }] = useMutation(UPDATE_LIKE);
  const [
    addToCart,
    { data: cartData, loading: cartLoading, error: cartError },
  ] = useMutation(ADD_TO_CART);

  const handleAddToCart = async () => {
    console.log("Cart item to be added to db", cartItem);
    if (!session?.user) {
      toast.success("Please login to add items to your cart!", {
        autoClose: 1000,
      });
      setTimeout(() => {
        router.push("/api/auth/signin");
      }, 2000);
      return;
    }

    let paylodCart = { ...cartItem, quantity: 1, productId: cartItem.id };
    try {
      const res = await addToCart({
        variables: {
          userId: session?.user?.id,
          items: [paylodCart],
        },
      });
      dispatch(addTocart({ ...cartItem, quantity: 1 }));
      console.log("Cart added to DB", res);
    } catch (error) {
      console.log(error);
    }
  };
  // Handle checkout
  const handleClick = async (event) => {
    // Get Stripe.js instance
    const payload = {};
    payload.userId = session?.user?.id;
    payload.line_items = [
      {
        id: id,
        title: title,
        price: price,
        image: image,
        description: description,
        quantity: 1,
      },
    ];
    payload.userProfile = null;

    // Call your backend to create the Checkout Session
    const { sessionId } = await fetch("/api/checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
  const [showShareButtons, setShowShareButtons] = useState(false);
  const handleShareButtonClick = () => {
    setShowShareButtons(!showShareButtons);
    setTimeout(() => setShowShareButtons(false), 5000);
  };

  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Xtreme Passion</h1>
      <div className="max-w-md ml-2 mr-0 bg-white rounded-xl shadow-md overflow-ds md:max-w-5xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0 mt-4 ml-2 cursor-pointer">
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
              {allergies && (
                <div className="bg-pink-50 mb-2 p-1 rounded-lg">
                  <span className="text-xs text-pink-600 font-medium">
                    Known Allergies :{" "}
                  </span>
                  <span className="text-xs text-pink-600">{allergies}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end">
              <div className="bg-gray-50 p-2 rounded-xl">
                <div className=" text-xs m-0 p-0 font-extralight">
                  Postage: <span className=" font-semibold">Standard</span>{" "}
                  Delivery
                </div>

                <div className=" text-xs my-0 font-extralight">
                  Delivery: Estimated Delivery within{" "}
                  <span className=" font-semibold">10-15</span> business days.
                </div>
                {policyType === "NO_RETURN_NO_WARRANTY" ? (
                  <div className=" text-xs my-0 font-extralight">
                    <Image
                      src="/return-warranty.png"
                      alt="logo"
                      width={190}
                      height={90}
                    />
                  </div>
                ) : (
                  <div className=" text-xs my-0 font-extralight">
                    Returns : <span className=" font-semibold">30 Days</span>{" "}
                    Economys return. Buyer pays for return postage.
                  </div>
                )}
              </div>
              <p className="mt-2 text-gray-700 font-bold">Price: ${price}</p>
              {stockQuantity < 1 ? (
                <div className="bg-red-100 text-red-500 rounded-full px-2 py-1 text-xs font-medium  w-24">
                  Out of Stock
                </div>
              ) : (
                <div className="flex flex-wrap justify-around mt-2 mb-2">
                  {" "}
                  <button
                    disabled={inCart}
                    className="bg-orange-100 text-orange-600 rounded-full  px-2 py-1 text-xs font-medium  w-24"
                    onClick={handleAddToCart}
                  >
                    {inCart ? "In Cart" : "Add to Cart"}
                    {inCart && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                  <button
                    className="bg-blue-100 text-blue-600 rounded-full  mx-2 px-1 py-1 text-xs font-medium  w-24"
                    onClick={handleClick}
                  >
                    Buy Now
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold mr-2 py-0 px-1 w-30 h-6 rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!session?.user) {
                        toast.success("Please login to like products!", {
                          autoClose: 1000,
                        });
                        setTimeout(() => {
                          router.push("/api/auth/signin");
                        }, 2000);
                        return;
                      }
                      updateLike({
                        variables: {
                          productId: id,
                          hasLiked: !isLiked,
                          userId: session?.user?.id,
                        },
                      });
                      setHasLiked(!blLiked);
                    }}
                  >
                    <svg className="inline w-6 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill={blLiked ? "red" : "black"}
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>

                    {blLiked ? "Unlike" : "Like"}
                  </button>
                  <button
                    onClick={handleShareButtonClick}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold  mr-2  py-0 px-2 w-30 h-6 rounded-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="inline h-4 w-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                      />
                    </svg>
                    <span className="ml-2">Share</span>{" "}
                  </button>
                  <span className="mt-1">
                    {" "}
                    {showShareButtons && (
                      <ShareButtons url={router.asPath} title={title} />
                    )}
                  </span>
                </div>
              )}

              {/* <div className="mt-4 flex space-x-4 my-3">
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-0 px-2 w-30 h-6 rounded-full"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!session?.user) {
                      toast.success("Please login to like products!", {
                        autoClose: 1000,
                      });
                      setTimeout(() => {
                        router.push("/api/auth/signin");
                      }, 2000);
                      return;
                    }
                    updateLike({
                      variables: {
                        productId: id,
                        hasLiked: !isLiked,
                        userId: session?.user?.id,
                      },
                    });
                    setHasLiked(!blLiked);
                  }}
                >
                  <svg className="inline w-6 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill={blLiked ? "red" : "black"}
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>

                  {blLiked ? "Unlike" : "Like"}
                </button>
                <button
                  onClick={handleShareButtonClick}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold  py-0 px-2 w-30 h-6 rounded-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="inline h-4 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                    />
                  </svg>

                  <span className="ml-2">Share</span>
                </button>
                {showShareButtons && (
                  <ShareButtons url={router.asPath} title={title} />
                )}
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-700 mt-7 ml-1 mr-2">
          You may like these products
        </h1>
      </div>
      {/* Scrollable container */}
      <div className="bg-gray-100 text-gray-500 w-full mt-4 ml-1 mr-2 ">
        {
          <div className="flex flex-row gap-1 overflow-x-auto">
            {topLikedProducts?.topProducts?.map((product) => (
              <ProductSimple
                key={product.id}
                title={product.title}
                description={product.description}
                price={product.price}
                image={product.image}
                id={product.id}
                stockQuantity={product.stockQuantity}
              />
            ))}
          </div>
        }
      </div>
      {session?.user ? (
        <div>
          <Comments prodId={id} />
        </div>
      ) : (
        <div className="text-2xl font-bold m-4 text-gray-400">
          Login to comment
        </div>
      )}
    </>
  );
};

export default ProductDetail;
