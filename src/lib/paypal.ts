export interface PayPalOrderResponse {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      value: string;
      currency_code: string;
    };
  }>;
}

export async function verifyPayPalOrder(
  orderId: string
): Promise<PayPalOrderResponse> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(
    `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`PayPal API error: ${response.status}`);
  }

  return response.json();
}
