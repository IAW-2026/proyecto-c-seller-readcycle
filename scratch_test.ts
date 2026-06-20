import { Client } from "pg";

async function getLatestOrderId() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log("DATABASE_URL is not set in env.");
    return "2";
  }

  // Clean pgBouncer query string if necessary or handle direct URL
  const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    // Query the latest order id
    const res = await client.query('SELECT id FROM "Order" ORDER BY "createdAt" DESC LIMIT 1');
    if (res.rows.length > 0) {
      const orderId = res.rows[0].id;
      console.log(`Successfully fetched latest order ID from database: ${orderId}`);
      return orderId;
    }
    console.log("No orders found in 'Order' table.");
  } catch (err: any) {
    console.error("Failed to query database using pg:", err.message);
  } finally {
    await client.end().catch(() => {});
  }
  return "2";
}

async function main() {
  const orderId = await getLatestOrderId();
  const url = "https://proyecto-c-shipping-readcycle.vercel.app/api/shipments";
  console.log(`Sending POST to ${url} with orderId: "${orderId}"`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "apitoken_readcycle_2026"
      },
      body: JSON.stringify({ orderId })
    });

    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log("Response Body (Raw):", text);

    try {
      const json = JSON.parse(text);
      console.log("Response Body (Parsed JSON):", json);
    } catch {
      // Not JSON
    }
  } catch (err: any) {
    console.error("Fetch error:", err.message || err);
  }
}

main();
