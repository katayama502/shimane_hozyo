import Link from "next/link";
import type { Metadata } from "next";
import {
  getAreaSubsidyCounts,
  getSiteStats,
  getTagSubsidyCounts,
  listMunicipalities,
  listTags,
  searchSubsidies,
} from "@/lib/db/queries";
import { buildFilters } from "@/lib/search/params";
import { SubsidyCard } from "@/components/subsidy/SubsidyCard";
import { formatJstDateTime } from "@/lib/date";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME}｜島根県の補助金・助成金検索` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const PURPOSE_CHIPS = ["equipment", "dx", "employment", "sales-channel", "startup", "energy-saving"];

export default async function TopPage() {
  const [stats, municipalities, purposeTags, areaCounts, purposeCounts, deadlineSoon, recentlyUpdated] =
    await Promise.all([
      getSiteStats(),
      listMunicipalities(),
      listTags("purpose"),
      getAreaSubsidyCounts(),
      getTagSubsidyCounts("purpose"),
      searchSubsidies(buildFilters({ sort: "deadline", status: "open" })),
      searchSubsidies(buildFilters({ sort: "updated" })),
    ]);

  const heroChips = purposeTags.filter((t) => PURPOSE_CHIPS.includes(t.slug));

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-200 bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            島根で使える補助金を、
            <br className="sm:hidden" />
            3分で。
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-600">{SITE_TAGLINE}</p>

          <form action="/subsidies" method="get" className="mt-7 flex flex-col gap-3 sm:flex-row">
            <select
              name="area"
              className="rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-base sm:w-64"
              defaultValue=""
              aria-label="市町村を選ぶ"
            >
              <option value="">市町村を選ぶ（任意）</option>
              <option value="shimane">島根県（県全域）</option>
              {municipalities.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-lg bg-teal-600 px-7 py-3.5 text-base font-bold text-white hover:bg-teal-700"
            >
              条件から探す
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {heroChips.map((tag) => (
              <Link
                key={tag.slug}
                href={`/purposes/${tag.slug}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-700 hover:border-teal-400 hover:text-teal-700"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          <dl className="mt-9 grid grid-cols-3 gap-4 text-center sm:max-w-md sm:text-left">
            <div>
              <dt className="text-sm text-slate-500">掲載件数</dt>
              <dd className="text-2xl font-bold text-slate-900">{stats.totalCount}件</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-500">募集中</dt>
              <dd className="text-2xl font-bold text-teal-700">{stats.openCount}件</dd>
            </div>
            <div className="col-span-3 sm:col-span-1">
              <dt className="text-sm text-slate-500">最終更新</dt>
              <dd className="text-base font-semibold text-slate-700">
                {formatJstDateTime(stats.lastVerifiedAt) ?? "―"}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-12">
        {/* 締切が近い制度 */}
        {deadlineSoon.rows.length > 0 && (
          <section>
            <SectionHeading title="締切が近い制度" href="/subsidies?sort=deadline&status=open" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {deadlineSoon.rows.slice(0, 4).map((s) => (
                <SubsidyCard key={s.id} subsidy={s} />
              ))}
            </div>
          </section>
        )}

        {/* 新着・更新された制度 */}
        <section>
          <SectionHeading title="新着・更新された制度" href="/subsidies?sort=updated" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyUpdated.rows.slice(0, 4).map((s) => (
              <SubsidyCard key={s.id} subsidy={s} />
            ))}
          </div>
        </section>

        {/* 市町村から探す */}
        <section id="areas">
          <SectionHeading title="市町村から探す" href="/subsidies" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {municipalities.map((m) => (
              <Link
                key={m.slug}
                href={`/areas/${m.slug}`}
                className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-base hover:border-teal-400 hover:bg-teal-50"
              >
                <span className="font-semibold text-slate-800">{m.name}</span>
                <span className="ml-1.5 text-sm text-slate-400">
                  {areaCounts[m.slug] ?? 0}件
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 目的から探す */}
        <section id="purposes">
          <SectionHeading title="目的から探す" />
          <div className="flex flex-wrap gap-2.5">
            {purposeTags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/purposes/${tag.slug}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-700 hover:border-teal-400 hover:text-teal-700"
              >
                {tag.name}
                <span className="ml-1.5 text-sm text-slate-400">{purposeCounts[tag.slug] ?? 0}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 相談窓口 */}
        <section>
          <SectionHeading title="島根県の相談窓口" />
          <div className="grid gap-4 sm:grid-cols-2">
            <ContactCard
              name="島根県 中小企業課"
              detail="県の補助金制度全般に関するお問い合わせ窓口です。"
              href="https://www.pref.shimane.lg.jp/"
            />
            <ContactCard
              name="しまね産業振興財団 経営支援部"
              detail="県内中小企業の経営支援・助成金に関するお問い合わせ窓口です。"
              href="https://www.joho-shimane.or.jp/"
            />
          </div>
        </section>

        {/* 使い方 */}
        <section>
          <SectionHeading title="はじめての方へ" />
          <ol className="grid gap-4 sm:grid-cols-3">
            <HowToStep step={1} title="市町村・目的を選ぶ" text="事業所の市町村や、やりたいことから候補を絞り込みます。" />
            <HowToStep step={2} title="候補を比較する" text="金額・締切・対象条件をカードで比較できます。" />
            <HowToStep step={3} title="公式ページで確認" text="最終判断は必ず実施機関の公式ページ・公募要領で確認してください。" />
          </ol>
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h2>
      {href && (
        <Link href={href} className="text-base font-semibold text-teal-700 hover:underline">
          すべて見る →
        </Link>
      )}
    </div>
  );
}

function ContactCard({ name, detail, href }: { name: string; detail: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300"
    >
      <p className="text-lg font-semibold text-slate-900">{name}</p>
      <p className="mt-1.5 text-base text-slate-600">{detail}</p>
    </a>
  );
}

function HowToStep({ step, title, text }: { step: number; title: string; text: string }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-base font-bold text-white">
        {step}
      </span>
      <p className="mt-3 text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-1.5 text-base text-slate-600">{text}</p>
    </li>
  );
}
