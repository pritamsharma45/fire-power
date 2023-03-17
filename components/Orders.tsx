import React from "react";

const OrderList = ({ orders }) => {
  const IMAGE_PREFIX = "https://drive.google.com/uc?export=view&id=";
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-12 gap-4 my-4">
        {orders.map((order) => (
          <div className="col-span-12 mx-2" key={order.id}>
            <div className="border rounded-lg p-4 hover:shadow-lg">
              <div className="flex flex-row">
                {/* Image */}
                <div className="mb-2 mr-2">
                  <img
                    src={IMAGE_PREFIX + order.product.image}
                    alt={order.product.title}
                    className="h-24 w-24 object-contain"
                  />
                </div>
                <div className="flex-col mx-2 w-7/12">
                  {/* Title */}
                  <div className="mb-2">
                    <strong>{order.product.title}</strong>
                  </div>
                  {/* Description */}
                  <div className="mb-2 text-xs">
                    {order.product.description}
                  </div>
                </div>
                <div className="flex-col mx-2">
                  {/* Price */}
                  <div className="mb-2 text-xs">Price:${order.price}</div>
                  {/* Quantity */}
                  <div className="mb-2 text-xs">Qty:{order.quantity}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
