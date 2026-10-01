import { NextResponse } from "next/server";
import { PILLARS, CAMPAIGNS, WINGS, SITE } from "../../../lib/content";

// Always the same static data — safe to export as a static file.
export const dynamic = "force-static";

// GET /api/pillars — the letter breakdown as JSON, for bots, widgets & remixes
export async function GET() {
  return NextResponse.json({ site: SITE, pillars: PILLARS, campaigns: CAMPAIGNS, wings: WINGS });
}