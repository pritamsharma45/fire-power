import React from "react";
import Image from "next/image";
import { Suspense } from "react";

const ProductDetail = ({
  title,
  description,
  price,
  image,
  id,
  stockQuantity,
}) => {
  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;
  return (
    <>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-ds md:max-w-4xl">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-48 w-full object-cover md:w96 md:h-auto"
              src={imageUrl}
              alt="Product Image"
              width={300}
              height={300}
            />
          </div>
          <div className="p-8">
            {/* <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
            Product
          </div> */}
            <a
              href="#"
              className="block mt-1 text-lg leading-tight font-medium text-black hover:underline"
            >
              {title}
            </a>
            <p className="mt-2 text-gray-500">{description}</p>
            <p className="mt-2 text-gray-700 font-bold">Price: ${price}</p>
            {stockQuantity < 1 && (
              <div className="bg-red-100 text-red-500 rounded-full px-2 py-1 text-xs font-medium  w-24">
                Out of Stock
              </div>
            )}
            <div className="mt-4 flex space-x-4">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 w-40 h-8 rounded-full">
                <svg className="inline w-6 h-6 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"
                  />
                </svg>
                Like
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

      <div>
        <div className="text-lg mt-4 underline">Comments</div>
        <div className="mt-4 inline-flex max-w-full">
          <input
            className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="text"
            name="comment"
            placeholder="Add comment.."
          />
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="inline ml-2 text-xs">Add</span>
          </button>
        </div>
        <ul>
          {}
          <li className="mt-4">
            <div className="flex">Comment 1</div>
          </li>
          <li className="mt-4">
            <div className="flex">Comment 2</div>
          </li>
          <li className="mt-4">
            <div className="flex">Comment 3</div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProductDetail;
