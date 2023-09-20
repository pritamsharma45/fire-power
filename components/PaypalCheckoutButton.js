import { PayPalButtons } from "@paypal/react-paypal-js";

// ******* This component is used in PayPalCheckout.tsx, which is  not used in anywhere in the project *******
//  Alternate way to import PayPalScriptProvider and PayPalButtons
// In this way we can PayPal checkout as component in any page rather than creating a separate page

const PaypalCheckoutButton = (props) => {
  const { product } = props;
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
      {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}
    </>
  );
};

export default PaypalCheckoutButton;
