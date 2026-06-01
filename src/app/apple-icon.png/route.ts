import { iconResponse } from "@/lib/appIcon";

export const dynamic = "force-static";

// iOS home-screen icon (apple-touch-icon) — 180x180.
export function GET() {
  return iconResponse(180);
}
