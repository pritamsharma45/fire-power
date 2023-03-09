import React, { useEffect } from "react";
import Image from "next/image";
import { gql, useMutation, useQuery } from "@apollo/client";
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
    <div>
      {
        (orders?.orderItems && <Orders orders={orders?.orderItems} />)
      }
      
    </div>
  );
}
