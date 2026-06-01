// Route chẩn đoán: đo thời gian fetch THÔ tới Supabase REST ngay trong function.
import dns from "node:dns";
export const dynamic = "force-dynamic";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const out: Record<string, unknown> = { hasUrl: !!url, hasKey: !!key };

  const t0 = Date.now();
  try {
    const r = await fetch(`${url}/rest/v1/topics?select=id&limit=1`, {
      headers: { apikey: key, authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    await r.text();
    out.status = r.status;
    out.rawFetchMs = Date.now() - t0;
  } catch (e) {
    out.error = String(e);
    out.rawFetchMs = Date.now() - t0;
  }
  return new Response(JSON.stringify(out), {
    headers: { "content-type": "application/json" },
  });
}
