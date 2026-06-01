// Route chẩn đoán: KHÔNG gọi gì cả, để đo cold-start thuần của Vercel (Node).
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(JSON.stringify({ ok: true, t: Date.now() }), {
    headers: { "content-type": "application/json" },
  });
}
