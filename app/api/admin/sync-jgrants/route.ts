import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/db/server";
import { runJgrantsSync } from "@/lib/ingestion/jgrants";

const bodySchema = z.object({
  keyword: z.string().trim().min(1).max(50).default("島根"),
});

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let json: unknown = {};
  try {
    json = await request.json();
  } catch {
    // no body is fine; use defaults
  }
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  try {
    const summary = await runJgrantsSync(parsed.data.keyword);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "sync failed" },
      { status: 502 }
    );
  }
}
