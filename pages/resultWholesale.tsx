import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { gql, useMutation, useQuery } from "@apollo/client";
import ScrollableProducts from "../components/ScrollableProducts";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Orders from "../components/Orders";
import "react-toastify/dist/ReactToastify.css";

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

const FETCH_PROMO_PRODUCTS = gql`
  query Query {
    promoProducts {
      product {
        title
        stockQuantity
        price
        image
        description
        id
      }
    }
  }
`;

const CREATE_SUBSCRIBER = gql`
  mutation Mutation($userId: String!) {
    addSubscriber(userId: $userId) {
      id
    }
  }
`;

const IS_SUBSCRIBED = gql`
  query Query($userId: String!) {
    isSubscribed(userId: $userId)
  }
`;

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

export default function Result() {
  const router = useRouter();
  const { session_id } = router.query;
  const [usedSessions, setUsedSessions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const { data: session } = useSession();

  const {
    data: promoData,
    loading: promoLoading,
    error: promoError,
  } = useQuery(FETCH_PROMO_PRODUCTS);
  console.log("PromoData", promoData);

  const [
    createOrder,
    { data: orderData, loading: orderLoading, error: orderError },
  ] = useMutation(CREATE_ORDER);

  const [
    deleteCart,
    { data: cartData, loading: cartLoading, error: cartError },
  ] = useMutation(DELETE_CART);

  const [
    createSubscriber,
    {
      data: subscriberData,
      loading: subscriberLoading,
      error: subscriberError,
    },
  ] = useMutation(CREATE_SUBSCRIBER);

  const {
    data: isSubscribedData,
    loading: isSubscribedLoading,
    error: isSubscribedError,
  } = useQuery(IS_SUBSCRIBED, {
    variables: { userId: session?.user?.id },
  });

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

  console.log("IsSubscribedData", isSubscribedData);

  // Set show taste in useEffect to avoid showing toast on initial render based when isSubscribed true or false

  useEffect(() => {
    if (isSubscribedData?.isSubscribed) {
      setShowToast(false);
    } else {
      const timer = setTimeout(() => {
        setShowToast(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSubscribedData]);

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

  // Subscriber Toast related methods

  const handleAllow = () => {
    // handle allowing promotional email notifications
    createSubscriber({ variables: { userId: session?.user?.id } });
    toast.success("Thanks for subscribing to our promotions!", {
      autoClose: 1000,
    });

    setShowToast(false);
  };

  return (
    <>
      <div>
        <div className="container mx-auto max-w-5xl my-5 px-5">
          <div className="my-2">
            <div className="bg-green-500 rounded-lg shadow-lg">
              <div className="text-white font-bold uppercase p-2">Success</div>
              <div className="p-2">
                <p className="text-white text-lg font-bold mb-4">
                  Congratulations! Your order has been successfully completed.
                </p>
                <p className="text-white mb-1">
                  Thank you for your purchase. We appreciate your business and
                  hope you enjoy your new items.
                </p>
                <p className="text-white">
                  If you have any questions or concerns, please do not hesitate
                  to contact us.
                </p>
              </div>
            </div>
          </div>
          <h1 className="text-xl font-bold mt-2">Orders</h1>
          {orders?.orderItems && <Orders orders={orders?.orderItems} />}
        </div>
      </div>
      {showToast && (
        <div className="fixed top-4 right-4 bg-white shadow-md rounded-md p-4">
          <p className="font-bold text-lg">Just one more step</p>
          <p>We will notify you about new products and promotions</p>
          <div className="flex flex-row justify-end">
            <button
              className="text-blue-600 bg-blue-100 font-bold rounded py-1 px-4 mx-2 mt-4"
              onClick={() => setShowToast(false)}
            >
              Later
            </button>
            <button
              className="bg-blue-500 text-white font-bold rounded py-1 px-4 mx-2 mt-4"
              onClick={handleAllow}
            >
              Allow
            </button>
          </div>
        </div>
      )}
      {/* {isSubscribedData?.isSubscribed ? (
        <div>Subscribed</div>
      ) : (
        <div>Not Subscribed</div>
      )} */}

      {/* <pre>
        {sessionData ? JSON.stringify(sessionData, null, 2) : "Loading..."}
      </pre> */}
    </>
  );
}
