import React from "react";
import Link from "next/link";

import "react-toastify/dist/ReactToastify.css";

const ProductSimple = ({
  title,
  description,
  price,
  image,
  id,
  stockQuantity,
}) => {
  const imageUrl = "https://drive.google.com/uc?export=view&id=" + image;

  return (
    <div key={id} className="">
      <Link href={`/product/${id}`} target="_blank">
        <div className="bg-white shadow-lg hover:shadow-xl rounded-sm w-52 h-60 m-2 p-2">
          <div
            className="bg-gray-400 h-24 w-32 p-2 bg-no-repeat bg-center bg-cover"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundPosition: "center",
            }}
          ></div>
             <p className="text-gray-500 text-xs font-bold font-nunito  mt-2">{title}</p>
          <p className="text-gray-500 text-xs font-nunito">{description}</p>

          <div className="flex justify-between items-start mt-2">
            <div className="text-right">
              {/* If stockeQuantity is greater than 0 then render below component or else render out of stock */}
              {stockQuantity > 0 ? (
                <>
                  <div className="text-teal-500 text-xs font-semibold  font-poppins">
                    ${price}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-500 text-xs font-semibold  font-poppins">
                    ${price}
                  </div>
                </>
              )}
            </div>
          </div>
       
        </div>
      </Link>
    </div>
  );
};

export default ProductSimple;
