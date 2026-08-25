import Link from "next/link";
import type { Metadata } from "next";
import { signOut } from "@/lib/auth/actions";

export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV_LINKS = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/subsidies", label: "制度一覧・承認" },
  { href: "/admin/ingestion", label: "Jグランツ同期" },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-slate-900">
              しまね補助金ナビ 管理画面
            </Link>
            <nav className="hidden gap-6 text-base font-medium text-slate-600 sm:flex">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-teal-700">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              ログアウト
            </button>
          </form>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 text-sm font-medium text-slate-600 sm:hidden">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-teal-700">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
