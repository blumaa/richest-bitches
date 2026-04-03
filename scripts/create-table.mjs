// One-time script to create the donations table via Supabase SQL API
const SUPABASE_URL = "https://zpimctylymxncmwzxqqo.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
}

const sql = `
  create table if not exists donations (
    id uuid primary key default gen_random_uuid(),
    donor_name text not null,
    amount numeric(10,2) not null,
    paypal_order_id text not null unique,
    created_at timestamptz default now()
  );
  create index if not exists idx_donations_amount on donations(amount desc);
`;

// Use the Supabase pg_net or direct query endpoint
const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
  method: "POST",
  headers: {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ query: sql }),
});

if (!res.ok) {
  console.log("REST RPC not available for DDL — use Supabase Dashboard SQL Editor instead.");
  console.log("\nCopy and paste this SQL into the SQL Editor at:");
  console.log("https://supabase.com/dashboard/project/zpimctylymxncmwzxqqo/sql/new\n");
  console.log(sql);
} else {
  console.log("Table created successfully!");
}
