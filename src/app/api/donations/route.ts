import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPayPalOrder } from "@/lib/paypal";
import { sanitizeName } from "@/lib/sanitize";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { donor_name, amount, paypal_order_id, social_handle } = body;

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

  if (!order.purchase_units || order.purchase_units.length === 0) {
    return NextResponse.json(
      { error: "Invalid PayPal order: missing purchase_units" },
      { status: 400 }
    );
  }

  const purchaseUnit = order.purchase_units[0];

  if (purchaseUnit.amount.currency_code !== "USD") {
    return NextResponse.json(
      { error: "Only USD donations are accepted" },
      { status: 400 }
    );
  }

  const verifiedAmount = parseFloat(purchaseUnit.amount.value);

  if (!verifiedAmount || verifiedAmount <= 0) {
    return NextResponse.json(
      { error: "Invalid PayPal order amount" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: sanitizedName,
      amount: verifiedAmount,
      paypal_order_id,
      social_handle: typeof social_handle === "string" && social_handle.trim()
        ? sanitizeName(social_handle.trim())
        : null,
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

  // Get donor's current rank from the leaderboard view
  const { data: leaderboard } = await supabase
    .from("leaderboard_view")
    .select("donor_name");

  const rank = leaderboard
    ? leaderboard.findIndex((e: { donor_name: string }) => e.donor_name === sanitizedName) + 1
    : 0;

  return NextResponse.json({ data, rank: rank || null }, { status: 201 });
}
