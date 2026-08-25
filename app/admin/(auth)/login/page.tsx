import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSupabaseServerClient } from "@/lib/db/server";

export const metadata = { title: "管理者ログイン", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.rpc("admin_bootstrap_available");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">管理者ログイン</h1>
        <p className="mt-1 text-sm text-slate-500">しまね補助金ナビ 管理画面</p>

        {error === "not_admin" && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            このアカウントには管理者権限がありません。
          </p>
        )}

        <div className="mt-6">
          <LoginForm next={next ?? "/admin"} />
        </div>

        {data && (
          <p className="mt-6 text-center text-sm text-slate-500">
            初回セットアップがまだの場合は{" "}
            <Link href="/admin/setup" className="font-semibold text-teal-700 hover:underline">
              管理者を登録
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
