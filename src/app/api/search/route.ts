import { NextRequest, NextResponse } from "next/server";

const AUTH_URL = "https://api.shopify.com/auth/access_token";
const MCP_URL = "https://discover.shopifyapps.com/global/mcp";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET");
  }

  const res = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    throw new Error(`Auth failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return cachedToken.value;
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q");
  if (!query?.trim()) {
    return NextResponse.json({ error: "Missing query parameter q" }, { status: 400 });
  }

  const shopIds = req.nextUrl.searchParams.getAll("shop_id").filter(Boolean);

  try {
    const token = await getAccessToken();

    const searchArgs: Record<string, unknown> = {
      query: query,
      context: 'customer looking for products',
    };
    if (shopIds.length > 0) {
      searchArgs.shop_ids = shopIds;
    }

    const body = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "search_global_products",
        arguments: searchArgs,
      },
    };

    const res = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Shopify API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const text = data?.result?.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ offers: [] });
    }
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
