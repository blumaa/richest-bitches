import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSelect = vi.fn();
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: mockSelect,
    }),
  },
}));

import { GET } from "./route";

const fakeDonations = Array.from({ length: 15 }, (_, i) => ({
  id: `uuid-${i}`,
  donor_name: `Donor ${i}`,
  amount: (15 - i) * 100,
  created_at: new Date().toISOString(),
}));

describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with an array", async () => {
    mockSelect.mockReturnValue({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("returns at most 10 entries", async () => {
    mockSelect.mockReturnValue({
      order: () => ({
        limit: () =>
          Promise.resolve({ data: fakeDonations.slice(0, 10), error: null }),
      }),
    });
    const res = await GET();
    const json = await res.json();
    expect(json.data.length).toBeLessThanOrEqual(10);
  });

  it("results are sorted by amount descending", async () => {
    const sorted = fakeDonations.slice(0, 10);
    mockSelect.mockReturnValue({
      order: () => ({
        limit: () => Promise.resolve({ data: sorted, error: null }),
      }),
    });
    const res = await GET();
    const json = await res.json();
    for (let i = 1; i < json.data.length; i++) {
      expect(json.data[i - 1].amount).toBeGreaterThanOrEqual(
        json.data[i].amount
      );
    }
  });

  it("each entry has id, donor_name, amount, created_at", async () => {
    mockSelect.mockReturnValue({
      order: () => ({
        limit: () =>
          Promise.resolve({ data: [fakeDonations[0]], error: null }),
      }),
    });
    const res = await GET();
    const json = await res.json();
    const entry = json.data[0];
    expect(entry).toHaveProperty("id");
    expect(entry).toHaveProperty("donor_name");
    expect(entry).toHaveProperty("amount");
    expect(entry).toHaveProperty("created_at");
  });

  it("returns empty array when no donations exist", async () => {
    mockSelect.mockReturnValue({
      order: () => ({
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
    });
    const res = await GET();
    const json = await res.json();
    expect(json.data).toEqual([]);
  });
});
