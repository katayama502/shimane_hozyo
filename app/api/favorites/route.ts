import { NextResponse } from "next/server";
import { z } from "zod";
import { getSubsidiesBySlugs } from "@/lib/db/queries";

const bodySchema = z.object({
  slugs: z.array(z.string().trim().min(1).max(200)).max(100),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  const subsidies = await getSubsidiesBySlugs(parsed.data.slugs);
  return NextResponse.json({ subsidies });
}
