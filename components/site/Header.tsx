import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const NAV_LINKS = [
  { href: "/subsidies", label: "補助金を探す" },
  { href: "/#areas", label: "市町村から探す" },
  { href: "/#purposes", label: "目的から探す" },
  { href: "/favorites", label: "お気に入り" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-base text-white">
            島
          </span>
          <span className="text-lg sm:text-xl">{SITE_NAME}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-base font-medium text-slate-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-teal-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/subsidies"
          className="rounded-lg bg-teal-600 px-4 py-2.5 text-base font-semibold text-white hover:bg-teal-700 md:hidden"
        >
          探す
        </Link>
      </div>
    </header>
  );
}
