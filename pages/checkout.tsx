import { useRouter } from "next/router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { gql, useMutation } from "@apollo/client";
import { useAppDispatch } from "../hooks/hooks";
import { emptyCart } from "../features/cart/cartSlice";
import dynamic from "next/dynamic";
const CREATE_ORDER = gql`
  mutation Mutation(
    $items: [OrderItemInput!]!
    $userId: String!
    $sessionId: String!
    $payment: PaymentTransactionInput!
    $shippingAddress: ShippingAddressInput!
  ) {
    createOrder(
      items: $items
      userId: $userId
      sessionId: $sessionId
      payment: $payment
      shippingAddress: $shippingAddress
    ) {
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


const NoSSRCheckoutComponent = () => {
  const router = useRouter();
  const payloadReceived = JSON.parse(router.query.payload as string);
  const [products, setProducts] = useState<any>(payloadReceived.line_items); // [1
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  const [response, setResponse] = useState(null);
  const [
    createOrder,
    { data: orderData, loading: orderLoading, error: orderError },
  ] = useMutation(CREATE_ORDER);

  const [
    deleteCart,
    { data: cartData, loading: cartLoading, error: cartError },
  ] = useMutation(DELETE_CART);

  const paypalCreateOrder = async () => {
    try {
      let response = await axios.post("/api/paypal/createorder", {
        body: payloadReceived,
      });
      setResponse(response);
      return response.data.data.response.result.id;
    } catch (err) {
      toast.error("Some Error Occured");
      return null;
    }
  };

  const handleOrderCreation = async (checkoutResponse) => {
    const {
      userId,
      line_items,
      item_total,
      item_total_excluding_tax,
      tax_total,
      shipping,
      userProfile,
    } = payloadReceived;

    const { id, links, payer, payment_source, purchase_units, success } =
      checkoutResponse;
    const { email_address } = payer;
    const { name } = purchase_units[0].shipping;
    const {
      address_line_1,
      admin_area_1,
      admin_area_2,
      country_code,
      postal_code,
    } = purchase_units[0].shipping.address;

    const items = line_items.map((item) => {
      return {
        quantity: item.quantity,
        price: item.price,
        productId: item.id,
      };
    });
    console.log("checkout response", checkoutResponse);
    const inputVariables = {
      userId: payloadReceived.userId,
      sessionId: id,
      items: items,
      shippingAddress: {
        line1: address_line_1,
        line2: admin_area_1,
        city: admin_area_2,
        state: "",
        country: country_code,
        postal_code,
        name: name.full_name || "",
      },
      payment: { amount: item_total + shipping, status: "success" },
    };
    console.log("input variables", inputVariables);
    await createOrder({
      variables: {
        userId: payloadReceived.userId,
        sessionId: id,
        items: items,
        shippingAddress: {
          line1: address_line_1,
          line2: admin_area_1,
          city: admin_area_2,
          state: "",
          country: country_code,
          postal_code,
          name: name.full_name || "",
        },
        payment: { amount: item_total + shipping, status: "success" },
      },
    });
    if (payloadReceived.fromCart) {
      await deleteCart({ variables: { userId: payloadReceived.userId } });
      dispatch(emptyCart());
    }
    router.push({
      pathname: "/success-paypal-checkout",
    });
  };

  const paypalCaptureOrder = async (orderID) => {
    try {
      let response = await axios.post("/api/paypal/captureorder", {
        orderID,
      });
      if (response.data.success) {
        // Order is successful
        toast.success("Purchase successful!");
        // redirect to success-paypal-checkout.tsx with response data
        setResponse(response.data.data.result);
        handleOrderCreation(response.data.data.result);
        // router.push({
        //   pathname: "/success-paypal-checkout",
        //   query: { response: JSON.stringify(response.data.data) },
        // });
      }
    } catch (err) {
      // Order is not successful

      toast.error("Some Error Occured");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-22">
        <a href="#" className="text-2xl font-bold text-gray-800">
          Lovejoint
        </a>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-22">
        {/* Left side Order Summary */}
        <div className="px-2 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items.
          </p>
          <div className="mt-8 rounded-lg border bg-white px-1 py-4 sm:px-3">
            <div className="space-y-3">
              {products.map((product) => (
                <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                  <img
                    className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                    src={product.imageUrl}
                    alt=""
                  />
                  <div className="flex w-full flex-col px-2 py-2">
                    <span className="font-semibold text-sm">
                      {product.title}
                    </span>
                    <span className="float-right text-gray-400 text-xs">
                      {product.description}
                    </span>
                    <p className="font-bold">
                      <span className="text-gray-500 font-bold text-xs mr-2">
                        Unit price:
                      </span>
                      <span className="text-gray-700 font-bold text-sm">
                        ${product.price.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      Qty: {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <hr />
            {/* Total */}
            <div>
              <div className="flex flex-row justify-between px-2 py-1">
                <span className="text-sm font-semibold mr-2 text-gray-700">
                  Item Total:
                </span>
                <span className="text-sm font-semibold  text-gray-700">
                  ${payloadReceived.item_total.toFixed(2)}
                </span>
              </div>
              {/* Add shipping in light gray font */}
              <div className="flex flex-row justify-between px-2 py-1">
                <span className="text-xs font-semibold mr-2 text-gray-600">
                  Shipping:
                </span>
                <span className="text-sm font-semibold  text-gray-600">
                  {payloadReceived.shipping === 0
                    ? "Free"
                    : "$" + payloadReceived.shipping.toFixed(2)}
                </span>
              </div>
              <hr />
              {/* Total */}
              <div className="flex flex-row justify-between px-2 py-1 ">
                <span className="text-lg font-semibold mr-2">Total:</span>
                <span className="text-lg font-semibold">
                  $
                  {(
                    payloadReceived.item_total + payloadReceived.shipping
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right side Checkout button */}
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
              Secure Checkout
              <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
            </h1>

            <p className="mt-10 mb-4 text-center text-sm font-semibold text-gray-500">
              By placing this order you agree to the{" "}
              <a
                href="#"
                className="whitespace-nowrap text-teal-400 underline hover:text-teal-600"
              >
                Terms and Conditions
              </a>
            </p>
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AeBeOhW4v7VitTE8hOYQ-glhngO-sOpY5tsIy1m0wrdLg0wm8DUZ6ggsGa2U-sMQCezP-KgyE6ND5ZFc",
                clientId:
                  "AeBeOhW4v7VitTE8hOYQ-glhngO-sOpY5tsIy1m0wrdLg0wm8DUZ6ggsGa2U-sMQCezP-KgyE6ND5ZFc",
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                style={{
                  color: "gold",
                  shape: "rect",
                  label: "pay",
                  height: 50,
                }}
                createOrder={async (data, actions) => {
                  let order_id = await paypalCreateOrder();
                  return order_id + "";
                }}
                onApprove={async (data, actions) => {
                  let response = await paypalCaptureOrder(data.orderID);
                  if (response) return true;
                }}
              />
            </PayPalScriptProvider>
          </div>
        </div>
      </div>
      {/* {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      <pre>{JSON.stringify(payloadReceived, null, 2)}</pre> */}
    </>
  );
};

const Checkout = dynamic(() => Promise.resolve(NoSSRCheckoutComponent), {
  ssr: false,
})

export default Checkout;
