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

const fakeEntries = Array.from({ length: 10 }, (_, i) => ({
  donor_name: `Donor ${i}`,
  total_amount: (10 - i) * 100,
  donation_count: 10 - i,
  last_donated_at: new Date().toISOString(),
}));

describe("GET /api/leaderboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 200 with an array", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });
    const res = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.data)).toBe(true);
  });

  it("returns at most 10 entries", async () => {
    mockSelect.mockResolvedValue({ data: fakeEntries, error: null });
    const res = await GET();
    const json = await res.json();
    expect(json.data.length).toBeLessThanOrEqual(10);
  });

  it("results are sorted by total_amount descending", async () => {
    mockSelect.mockResolvedValue({ data: fakeEntries, error: null });
    const res = await GET();
    const json = await res.json();
    for (let i = 1; i < json.data.length; i++) {
      expect(json.data[i - 1].total_amount).toBeGreaterThanOrEqual(
        json.data[i].total_amount
      );
    }
  });

  it("each entry has donor_name, total_amount, donation_count, last_donated_at", async () => {
    mockSelect.mockResolvedValue({ data: [fakeEntries[0]], error: null });
    const res = await GET();
    const json = await res.json();
    const entry = json.data[0];
    expect(entry).toHaveProperty("donor_name");
    expect(entry).toHaveProperty("total_amount");
    expect(entry).toHaveProperty("donation_count");
    expect(entry).toHaveProperty("last_donated_at");
  });

  it("returns empty array when no donations exist", async () => {
    mockSelect.mockResolvedValue({ data: [], error: null });
    const res = await GET();
    const json = await res.json();
    expect(json.data).toEqual([]);
  });

  it("returns 500 on database error", async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: "db error" } });
    const res = await GET();
    expect(res.status).toBe(500);
  });
});
