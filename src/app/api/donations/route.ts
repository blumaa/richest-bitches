import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPayPalOrder } from "@/lib/paypal";
import { sanitizeName } from "@/lib/sanitize";

export async function POST(request: Request) {
  const body = await request.json();
  const { donor_name, amount, paypal_order_id } = body;

  if (!donor_name || typeof donor_name !== "string" || donor_name.trim() === "") {
    return NextResponse.json(
      { error: "donor_name is required" },
      { status: 400 }
    );
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "amount must be a positive number" },
      { status: 400 }
    );
  }

  if (!paypal_order_id || typeof paypal_order_id !== "string") {
    return NextResponse.json(
      { error: "paypal_order_id is required" },
      { status: 400 }
    );
  }

  const sanitizedName = sanitizeName(donor_name);

  if (sanitizedName.length > 50) {
    return NextResponse.json(
      { error: "donor_name must be 50 characters or less" },
      { status: 400 }
    );
  }

  const order = await verifyPayPalOrder(paypal_order_id);

  if (order.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "PayPal order is not completed" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: sanitizedName,
      amount,
      paypal_order_id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Donation already recorded" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
