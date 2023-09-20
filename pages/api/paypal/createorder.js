import paypal from "@paypal/checkout-server-sdk";
import client from "../../../utils/paypal";

export default async function Handler(req, res) {
  if (req.method != "POST")
    return res.status(404).json({ success: false, message: "Not Found" });

  const {
    userId,
    line_items,
    item_total,
    item_total_excluding_tax,
    tax_total,
    shipping,
    userProfile,
  } = req.body.body;
  const items = line_items.map((item) => {
    return {
      name: item.title,
      description: item.title,
      unit_amount: {
        currency_code: "gbp",
        value: item.priceExcludingTax.toFixed(2) + "", // Price of the product
      },
      quantity: item.quantity + "",
    };
  });
  const purchase_units = [
    {
      description: "Wellness products",
      amount: {
        currency_code: "gbp",
        value: (item_total + shipping).toFixed(2), // Total value including tax
        breakdown: {
          item_total: {
            currency_code: "gbp",
            value: item_total_excluding_tax.toFixed(2) + "", // Total value of the items without tax
          },
          tax_total: {
            currency_code: "gbp",
            value: tax_total.toFixed(2), // Tax amount
          },
          shipping: {
            currency_code: "gbp",
            value: shipping + "", // Shipping amount
          },
        },
      },
      items: items,
    },
  ];

  console.log("api | paypal | createOrder.tsx | request body : ", items);
  console.log(
    "api | paypal | createOrder.tsx | request body : ",
    JSON.stringify(purchase_units, null, 2)
  );

  try {
    const PaypalClient = client();
    //This code is lifted from https://github.com/paypal/Checkout-NodeJS-SDK
    const request = new paypal.orders.OrdersCreateRequest();
    request.headers["prefer"] = "return=representation";
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "Wellness products",
          amount: {
            currency_code: "gbp",
            value: (item_total + shipping).toFixed(2), // Total value including tax
            breakdown: {
              item_total: {
                currency_code: "gbp",
                value: item_total_excluding_tax + "", // Total value of the items without tax
              },
              tax_total: {
                currency_code: "gbp",
                value: tax_total, // Tax amount
              },
              shipping: {
                currency_code: "gbp",
                value: shipping + "", // Shipping amount
              },
            },
          },
          items: items,
        },
      ],
    });
    const response = await PaypalClient.execute(request);
    if (response.statusCode !== 201) {
      console.log("RES: ", response);
      return res
        .status(500)
        .json({ success: false, message: "Some Error Occured at backend" });
    }

    res.status(200).json({ success: true, data: { response } });
  } catch (err) {
    console.log("Err at Create Order: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Could Not Found the user" });
  }
}
