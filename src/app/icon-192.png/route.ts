import { iconResponse } from "@/lib/appIcon";

export const dynamic = "force-static";

export function GET() {
  return iconResponse(192);
}
