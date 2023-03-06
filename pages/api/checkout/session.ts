import { NextApiRequest } from "next/types";
import { NextApiResponse } from "next";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let lineItems = [];
  if (Array.isArray(req.body)) {
    lineItems = req.body.map((item) => {
      const { title, price, description, quantity } = item;
      const name = title;
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name,
            description,
          },
          unit_amount: Number(price) * 1000,
        },
        quantity: Number(quantity),
      };
    });
  } else {
    const { title, price, description } = req.body;
    const name = title;
    lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name,
            description,
          },
          unit_amount: Number(price) * 1000,
        },
        quantity: 1,
      },
    ];
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${req.headers.origin}/result`,
    cancel_url: `${req.headers.origin}/checkout`,
  });

  res.status(200).json({ sessionId: session.id });
}
