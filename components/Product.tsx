import React from "react";
import { Suspense } from "react";
import Link from "next/link";

const Product = ({ title, description, price, image, id, stockQuantity }) => {
  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;
  return (
    <Suspense fallback={<h1>Loading persons...</h1>}>
      {/* <div key={id} className="shadow  max-w-md  rounded h-60">
        <div className="p-5 flex flex-col space-y-2">
          <p className="text-sm font-medium">{image}</p>
          <p className="text-lg font-medium">{title}</p>
          <p className="text-sm font-medium">{description}</p>
          <p className="text-sm text-blue-500">{price}</p>
        </div>
      </div> */}

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
                className="text-pink-500 hover:text-pink-600 p-2 rounded-full"
                style={{
                  backgroundColor: "black",
                  color: "pink",
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              <button className="block w-full  h-8 bg-white hover:bg-gray-100 text-teal-500 border-2 border-teal-500 px-1 pb-0 rounded uppercase font-poppins font-medium">
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>{" "}
                <span className="mb-0 text-xs">Add to cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Product;
