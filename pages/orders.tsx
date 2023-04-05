import React from "react";

import { gql, useQuery } from "@apollo/client";
import Orders from "../components/Orders";

import { useSession } from "next-auth/react";

const GET_ORDERS = gql`
  query Query($userId: String!) {
    orderItems(userId: $userId) {
      quantity
      price
      product {
        title
        price
        description
        image
      }
    }
  }
`;

export default function AllOrders() {
  const { data: session, status } = useSession();
  console.log("Session", session);

  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
  } = useQuery(GET_ORDERS, {
    variables: {
      userId: session?.user.id,
    },
  });
  console.log(orders);

  return (
    <div className="container mx-auto max-w-5xl my-5 px-5">
      <h1 className="text-xl font-bold mt-2">Orders</h1>
      {orders?.orderItems ? (
        <Orders orders={orders?.orderItems} />
      ) : (
        <div className="text-center">
          <h1 className="text-xl font-bold mt-2">No orders to display!</h1>
        </div>
      )}
    </div>
  );
}
