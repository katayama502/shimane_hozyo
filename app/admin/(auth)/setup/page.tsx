import Link from "next/link";
import { SetupForm } from "@/components/admin/SetupForm";
import { getSupabaseServerClient } from "@/lib/db/server";

export const metadata = { title: "管理者初期セットアップ", robots: { index: false, follow: false } };

export default async function AdminSetupPage() {
  const supabase = await getSupabaseServerClient();
  const { data: available } = await supabase.rpc("admin_bootstrap_available");

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">管理者の初期登録</h1>
        <p className="mt-1 text-sm text-slate-500">
          最初の1人だけ、このページから管理者アカウントを作成できます。
        </p>

        {available ? (
          <div className="mt-6">
            <SetupForm />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              管理者はすでに登録済みです。このページは無効化されています。
            </p>
            <Link
              href="/admin/login"
              className="block rounded-lg bg-teal-600 px-5 py-3 text-center text-base font-bold text-white hover:bg-teal-700"
            >
              ログインページへ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
