import paypal from "@paypal/checkout-server-sdk";
import client from "../../../utils/paypal";

export default async function Handler(req, res) {
  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  if (!req.body.orderID)
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Order ID" });

  //Capture order to complete payment
  const { orderID } = req.body;
  const PaypalClient = client();
  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});
  const response = await PaypalClient.execute(request);
  if (!response) {
    return res
      .status(500)
      .json({ success: false, message: "Some Error Occured at backend" });
  }

  res.status(200).json({ success: true, data: response });
}
