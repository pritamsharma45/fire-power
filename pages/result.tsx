import { useRouter } from "next/router";
import { useEffect ,useState} from "react";
import useSWR from "swr";
import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_ORDER = gql`
  mutation Mutation(
    $total: Float!
    $items: [OrderItemInput!]!
    $userId: String!
    $payment: PaymentTransactionInput!
  ) {
    createOrder(
      total: $total
      items: $items
      userId: $userId
      payment: $payment
    ) {
      total
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
      const { payment_intent, status, amount_total } = data.session;
      const { PAYEMENT_RECEIVED } = data.session.payment_intent;
      let { userId, line_items } = data.session.metadata;
      line_items = JSON.parse(line_items);
      line_items = line_items.map((item) => {
        return {
          quantity: item.quantity,
          price: item.price,
          productId: item.id,
        };
      });
      console.log("LineItems", line_items);
      console.log("Payment Intent", status);

      await createOrder({
        variables: {
          total: amount_total,
          items: line_items,
          userId: userId,
          payment: { amount: amount_total, status: "success" },
        },
      });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log("Session Data", data);
      },
    }
  );

  return (
    <div>
      <h1>Result</h1>
      <p>Success</p>
      <pre>
        {sessionData ? JSON.stringify(sessionData, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}
