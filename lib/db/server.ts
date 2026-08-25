import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Server-side Supabase client (RLS-enforced with the anon/publishable key).
 * Used for both the public site's read-only queries and the admin auth session
 * (sign-in/sign-out, `is_admin()`-gated queries).
 *
 * Cookie writes only take effect when called from a Server Action or Route
 * Handler; Server Components render read-only, so the write is a silent no-op
 * there (Next.js would otherwise throw) — session refresh for those requests
 * is handled by `middleware.ts`.
 */
export async function getSupabaseServerClient() {
  // Call cookies() before any early return: reading it is what tells Next.js
  // this route is request-dynamic. Throwing on a missing env var *first* would
  // skip that signal, so a misconfigured deployment fails the static-generation
  // build step ("prerendering error") for every page instead of failing at
  // request time on just the pages that actually run.
  const cookieStore = await cookies();

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render; ignore.
        }
      },
    },
  });
}
