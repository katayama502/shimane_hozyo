import Link from "next/link";
import { DISCLAIMER_TEXT, SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-500">{DISCLAIMER_TEXT}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base text-slate-600">
          <Link href="/subsidies" className="hover:text-teal-700">
            補助金を探す
          </Link>
          <Link href="/favorites" className="hover:text-teal-700">
            お気に入り
          </Link>
        </div>
        <p className="mt-6 text-sm text-slate-400">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
