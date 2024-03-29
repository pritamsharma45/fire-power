import React from "react";
import { Suspense } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { gql, useMutation } from "@apollo/client";
import AddToCart from "../features/cart/AddToCart";
import { TCartItem } from "../features/cart/AddToCart";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
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

const Product = ({
  title,
  description,
  allergies,
  policyType,
  price,
  mrp,
  image,
  id,
  stockQuantity,
  hasLiked,
  userId,
  inCart,
}) => {
  const imageUrl = "https://drive.google.com/thumbnail?id=" + image + "&sz=w1000";

  const cartItem: TCartItem = {
    id: id,
    title: title,
    description: description,
    price: price,
    image: image,
  };
  const { data: session, status } = useSession();
  const router = useRouter();
  const [updateLike, { data, loading, error }] = useMutation(UPDATE_LIKE);

  const [isLiked, setHasLiked] = React.useState(hasLiked);

  const handleLikeProduct = async () => {
    if (!session?.user) {
      toast.success("Please login to add items to your cart!", {
        autoClose: 1000,
      });
      setTimeout(() => {
        router.push("/api/auth/signin");
      }, 2000);
      return;
    }

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
    <Suspense fallback={<h1>Loading ...</h1>}>
      <div key={id} className="">
        <div className="flex flex-col justify-around  h-72 shadow-lg hover:shadow-xl rounded-lg transition-transform duration-500 transform hover:scale-105">
          <div>
            <a href={`/product/${id}`}>

              <div
                className="bg-gray-400 h-32  rounded-t-lg p-4 bg-no-repeat bg-center bg-cover cursor-pointer"
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
            </a>

            <div className="flex justify-between items-start px-2 pt-0 h-32">
              <div className="p-1 flex-grow">
                <h1 className="font-medium text-sm font-poppins">{title}</h1>
                <p className="text-gray-500 text-xs font-nunito">
                  {description}
                </p>
              </div>
              <div className="p-1 text-right">
                {/* If stockeQuantity is greater than 0 then render below component or else render out of stock */}
                {stockQuantity > 0 ? (
                  <>
                    <div className="text-teal-500 text-md font-semibold  font-poppins">
                      £{price}
                      {mrp && (
                        <>
                          <span className="mt-2 ml-2 text-xs text-gray-500">
                            {" "}
                            £
                          </span>
                          <span className="mt-2  text-xs text-gray-500 line-through font-bold">
                            {mrp}
                          </span>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-gray-500 text-md font-semibold  font-poppins">
                      £{price}
                      {mrp && (
                        <>
                          <span className="mt-2 ml-2 text-xs text-gray-500">
                            {" "}
                            £
                          </span>
                          <span className="mt-2  text-xs text-gray-500 line-through font-bold">
                            {mrp}
                          </span>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex px-2 pb-1">
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
            {
              // If stockeQuantity is greater than 0 then render below component or else render out of stock
              stockQuantity > 0 ? (
                <div className="w-1/2 p-1">
                  <AddToCart cartItem={cartItem} inCart={inCart} />
                </div>
              ) : (
                <div className="bg-red-100 w-1/2 h-8 mt-1 mx-1 text-red-500 text-center  rounded-full px-2 py-2 text-xs font-medium">
                  Out of Stock
                </div>
              )
            }
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Product;
