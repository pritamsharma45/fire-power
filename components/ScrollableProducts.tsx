import React from "react";
import ProductSimple from "./ProductSimple";

export default function ScrollableProducts({ products }) {
    console.log("products", products)
  return (
    <div className="bg-gray-100 text-gray-500 w-full mt-4 ml-1 mr-2 ">
      {
        <div className="flex flex-row gap-1 overflow-x-auto">
          {products?.map(({product}) => (
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
  );
}
