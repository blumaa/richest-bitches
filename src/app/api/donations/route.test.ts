import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase
const mockInsert = vi.fn();
const mockLeaderboardSelect = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (table: string) => {
      if (table === "leaderboard_view") {
        return { select: mockLeaderboardSelect };
      }
      return { insert: mockInsert };
    },
  },
}));

// Mock paypal
const mockVerifyPayPalOrder = vi.fn();
vi.mock("@/lib/paypal", () => ({
  verifyPayPalOrder: (...args: unknown[]) => mockVerifyPayPalOrder(...args),
}));

import { POST } from "./route";

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/donations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  donor_name: "Test User",
  amount: 100,
  paypal_order_id: "ORDER123",
};

describe("POST /api/donations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "COMPLETED",
      purchase_units: [{ amount: { value: "100.00", currency_code: "USD" } }],
    });
    mockLeaderboardSelect.mockResolvedValue({
      data: [{ donor_name: "Test User" }],
      error: null,
    });
    mockInsert.mockReturnValue({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: { id: "uuid-1", ...validBody, created_at: new Date().toISOString() },
            error: null,
          }),
      }),
    });
  });

  it("returns 400 if donor_name is missing", async () => {
    const res = await POST(makeRequest({ amount: 100, paypal_order_id: "O1" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/donor_name/i);
  });

  it("returns 400 if donor_name is empty", async () => {
    const res = await POST(
      makeRequest({ donor_name: "  ", amount: 100, paypal_order_id: "O1" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if amount is missing", async () => {
    const res = await POST(
      makeRequest({ donor_name: "Test", paypal_order_id: "O1" })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/amount/i);
  });

  it("returns 400 if amount is zero", async () => {
    const res = await POST(
      makeRequest({ donor_name: "Test", amount: 0, paypal_order_id: "O1" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if amount is negative", async () => {
    const res = await POST(
      makeRequest({ donor_name: "Test", amount: -5, paypal_order_id: "O1" })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if paypal_order_id is missing", async () => {
    const res = await POST(
      makeRequest({ donor_name: "Test", amount: 100 })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/paypal_order_id/i);
  });

  it("returns 400 if donor_name exceeds 50 characters", async () => {
    const res = await POST(
      makeRequest({
        donor_name: "A".repeat(51),
        amount: 100,
        paypal_order_id: "O1",
      })
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 if PayPal order is not COMPLETED", async () => {
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "PENDING",
      purchase_units: [{ amount: { value: "100.00", currency_code: "USD" } }],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/not completed/i);
  });

  it("returns 409 if paypal_order_id already exists", async () => {
    mockInsert.mockReturnValue({
      select: () => ({
        single: () =>
          Promise.resolve({
            data: null,
            error: { code: "23505", message: "duplicate" },
          }),
      }),
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
  });

  it("sanitizes donor_name (strips HTML)", async () => {
    const req = makeRequest({
      donor_name: '<script>alert("xss")</script>Rich Guy',
      amount: 100,
      paypal_order_id: "ORDER123",
    });
    await POST(req);
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.donor_name).not.toContain("<script>");
    expect(insertCall.donor_name).toContain("Rich Guy");
  });

  it("returns 201 with donation record and rank on valid input", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data).toHaveProperty("id");
    expect(json.data.donor_name).toBe("Test User");
    expect(json.rank).toBe(1);
  });

  it("calls PayPal API to verify order", async () => {
    await POST(makeRequest(validBody));
    expect(mockVerifyPayPalOrder).toHaveBeenCalledWith("ORDER123");
  });

  it("uses PayPal-verified amount, not client-submitted amount", async () => {
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "COMPLETED",
      purchase_units: [{ amount: { value: "25.00", currency_code: "USD" } }],
    });
    await POST(
      makeRequest({ donor_name: "Test", amount: 9999, paypal_order_id: "ORDER123" })
    );
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.amount).toBe(25);
  });

  it("returns 400 if PayPal order has no purchase_units", async () => {
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "COMPLETED",
      purchase_units: [],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/purchase_units/i);
  });

  it("returns 400 if PayPal currency is not USD", async () => {
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "COMPLETED",
      purchase_units: [{ amount: { value: "100.00", currency_code: "EUR" } }],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/USD/i);
  });

  it("stores social_handle when provided", async () => {
    await POST(
      makeRequest({ ...validBody, social_handle: "@richguy" })
    );
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.social_handle).toBe("@richguy");
  });

  it("stores null social_handle when not provided", async () => {
    await POST(makeRequest(validBody));
    const insertCall = mockInsert.mock.calls[0][0];
    expect(insertCall.social_handle).toBeNull();
  });

  it("returns 400 if PayPal verified amount is zero or negative", async () => {
    mockVerifyPayPalOrder.mockResolvedValue({
      id: "ORDER123",
      status: "COMPLETED",
      purchase_units: [{ amount: { value: "0.00", currency_code: "USD" } }],
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(400);
  });
});
