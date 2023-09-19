import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";

export const PayPalCheckoutPage = ({ products }) => {
  const { data: session, status } = useSession();
  const [response, setResponse] = useState(null);

  const paypalCreateOrder = async () => {
    try {
      let response = await axios.post("/api/paypal/createorder", {
        user_id: "test_user_id",
        order_price: 580,
      });
      setResponse(response);
      return response.data.data.response.result.id;
    } catch (err) {
      toast.error("Some Error Occured");
      return null;
    }
  };

  const paypalCaptureOrder = async (orderID) => {
    try {
      let response = await axios.post("/api/paypal/captureorder", {
        orderID,
      });
      if (response.data.success) {
        // Order is successful
        toast.success("Purchase successful!");
      }
    } catch (err) {
      // Order is not successful

      toast.error("Some Error Occured");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center border-b bg-white py-4 sm:flex-row sm:px-10 lg:px-20 xl:px-32">
        <a href="#" className="text-2xl font-bold text-gray-800">
          Lovejoint
        </a>
      </div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        {/* Left side Order Summary */}
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {products.map((product) => (
              <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                <img
                  className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                  src="https://images.unsplash.com/flagged/photo-1556637640-2c80d3201be8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
                  alt=""
                />
                <div className="flex w-full flex-col px-4 py-4">
                  <span className="font-semibold">{product.title}</span>
                  <span className="float-right text-gray-400">
                    {product.quantity}
                  </span>
                  <p className="text-lg font-bold">${product.price}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-lg font-medium">Shipping Methods</p>
          <form className="mt-5 grid gap-6">
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_1"
                type="radio"
                name="radio"
                checked
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                for="radio_1"
              >
                <img
                  className="w-14 object-contain"
                  src="/images/naorrAeygcJzX0SyNI4Y0.png"
                  alt=""
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">Fedex Delivery</span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 2-4 Days
                  </p>
                </div>
              </label>
            </div>
            <div className="relative">
              <input
                className="peer hidden"
                id="radio_2"
                type="radio"
                name="radio"
                checked
              />
              <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white"></span>
              <label
                className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                for="radio_2"
              >
                <img
                  className="w-14 object-contain"
                  src="/images/oG8xsl3xsOkwkMsrLGKM4.png"
                  alt=""
                />
                <div className="ml-5">
                  <span className="mt-2 font-semibold">Fedex Delivery</span>
                  <p className="text-slate-500 text-sm leading-6">
                    Delivery: 2-4 Days
                  </p>
                </div>
              </label>
            </div>
          </form>
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
                currency: "gbp",
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

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </>
  );
};
