import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation CreateOrder(
    $items: [OrderItemInput!]!
    $userId: String!
    $payment: PaymentTransactionInput!
  ) {
    createOrder(items: $items, userId: $userId, payment: $payment) {
      id
    }
  }
`;

const DELETE_CART = gql`
  mutation DeleteCartByUserId($userId: String!) {
    deleteCartByUserId(userId: $userId) {
      id
    }
  }
`;

export default function Result() {
  const router = useRouter();
  const { session_id } = router.query;
  const [usedSessions, setUsedSessions] = useState([]);

  const [
    createOrder,
    { data: orderData, loading: orderLoading, error: orderError },
  ] = useMutation(CREATE_ORDER);

  const [
    deleteCart,
    { data: cartData, loading: cartLoading, error: cartError },
  ] = useMutation(DELETE_CART);

  const {
    data: sessionData,
    error: sessionError,
    mutate,
  } = useSWR(
    session_id ? `/api/checkout/${session_id}` : null,
    async (url) => {
      const res = await fetch(url);
      const data = await res.json();
      // Check if session has already been used to create an order
      if (usedSessions.includes(session_id)) {
        return data;
      }

      // Mark session ID as used
      setUsedSessions((prevSessions) => [...prevSessions, session_id]);
      // Create order after receiving session object
      console.log("Now creating Order");
      // await createOrder({ variables: { /* Order variables */ } });
      const { payment_intent, status, amount_total, client_reference_id } =
        data.session;
      const { PAYEMENT_RECEIVED } = data.session.payment_intent;
      let { line_items } = data.session.metadata;
      line_items = JSON.parse(line_items);
      line_items = line_items.map((item) => {
        return {
          quantity: item.q,
          price: item.p,
          productId: item.id,
        };
      });
      console.log("LineItems", line_items);
      console.log("Payment Intent", status);

      await createOrder({
        variables: {
          items: line_items,
          userId: client_reference_id,
          payment: { amount: amount_total, status: "success" },
        },
      });

      await deleteCart({ variables: { userId: client_reference_id } });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log("Session Data", data);
      },
    }
  );

  return (
    <>
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-green-500 rounded-lg shadow-lg">
          <div className="text-white font-bold uppercase p-8">Success</div>
          <div className="p-8">
            <p className="text-white text-lg font-bold mb-4">
              Congratulations! Your order has been successfully completed.
            </p>
            <p className="text-white mb-4">
              Thank you for your purchase. We appreciate your business and hope
              you enjoy your new items.
            </p>
            <p className="text-white">
              If you have any questions or concerns, please do not hesitate to
              contact us.
            </p>
          </div>
        </div>
      </div>
      <pre>
        {sessionData ? JSON.stringify(sessionData, null, 2) : "Loading..."}
      </pre>
    </>
  );
}
