"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/db/server";

export type AuthActionState = { error?: string } | undefined;

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "メールアドレスまたはパスワードが正しくありません。" };
  }
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function bootstrapAdmin(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");

  if (password.length < 8) {
    return { error: "パスワードは8文字以上で設定してください。" };
  }

  const supabase = await getSupabaseServerClient();

  const { data: available } = await supabase.rpc("admin_bootstrap_available");
  if (!available) {
    return { error: "管理者はすでに登録されています。ログインページからお進みください。" };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError || !signUpData.user) {
    return { error: signUpError?.message ?? "登録に失敗しました。" };
  }

  const { error: profileError } = await supabase.from("admin_profiles").insert({
    id: signUpData.user.id,
    role: "owner",
    display_name: displayName || null,
  });
  if (profileError) {
    return { error: `管理者登録に失敗しました: ${profileError.message}` };
  }

  redirect("/admin");
}
