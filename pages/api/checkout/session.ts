import { NextApiRequest } from "next/types";
import { NextApiResponse } from "next";
import { Json } from "../../../graphql/types";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { line_items, userId, userProfile } = req.body;
  console.log("User profile in checkout session", userProfile);

  let arr = [...line_items].map((item) => {
    return {
      id: item.id,
      q: item.quantity,
      p: item.price,
    };
  });
  let stringifiedLineItems = JSON.stringify(arr);

  let lineItems = [];
  // console.log("line_items from payload:-", line_items);
  if (Array.isArray(line_items)) {
    lineItems = line_items.map((item) => {
      const { title, price, description, quantity } = item;
      const name = title;
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name,
            description,
            metadata: {
              id: item.id,
            },
          },
          unit_amount: Number(price) * 100,
        },
        quantity: Number(quantity),
      };
    });
  }
  let session = null;
  if (!userProfile) {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      client_reference_id: userId,
      metadata: {
        line_items: stringifiedLineItems,
        user_Id: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["US", "IN"],
      },
      custom_text: {
        shipping_address: {
          message:
            "We are collecting shipping address to deliver your order as you have not provided your shipping address in your profile.",
        },
      },
    });
  } else {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      client_reference_id: userId,
      metadata: {
        line_items: stringifiedLineItems,
        user_Id: userId,
      },
      custom_text: {
        shipping_address: {
          message:
            "Please note that we will use shipping address from your profile.",
        },
      },
    });
  }

  res.status(200).json({ sessionId: session.id });
}
