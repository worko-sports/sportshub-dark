import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import shortid from "shortid";

export async function POST(req) {
  try {
    const { amount, currency = "INR" } = await req.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const payment_capture = 1;
    const options = {
      amount: (amount * 100).toString(), // Amount in smallest currency unit (paise)
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    const response = await razorpay.orders.create(options);

    return NextResponse.json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
