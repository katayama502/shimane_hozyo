import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getChangeLogs,
  getRelatedSubsidies,
  getSubsidyBySlug,
} from "@/lib/db/queries";
import { StatusBadge } from "@/components/subsidy/StatusBadge";
import { DeadlineText } from "@/components/subsidy/DeadlineText";
import { FavoriteButton } from "@/components/subsidy/FavoriteButton";
import { DisclaimerNote } from "@/components/site/DisclaimerNote";
import { formatAmountRange } from "@/lib/format";
import { formatJstDate, formatJstDateTime } from "@/lib/date";
import { effectiveStatus, statusLabel } from "@/lib/status";
import { SITE_NAME } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const subsidy = await getSubsidyBySlug(slug);
  if (!subsidy) return {};

  return {
    title: subsidy.title,
    description: subsidy.summary,
    alternates: { canonical: `/subsidies/${slug}` },
    openGraph: {
      title: `${subsidy.title}｜${SITE_NAME}`,
      description: subsidy.summary,
    },
  };
}

export default async function SubsidyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const subsidy = await getSubsidyBySlug(slug);
  if (!subsidy) notFound();

  const areas = subsidy.subsidy_areas.map((sa) => sa.areas).filter(Boolean);
  const purposeTags = subsidy.subsidy_tags
    .map((st) => st.tags)
    .filter((t) => t?.category === "purpose");
  const industryTags = subsidy.subsidy_tags
    .map((st) => st.tags)
    .filter((t) => t?.category === "industry");
  const primaryAreaSlug = areas.find((a) => a?.level === "municipality")?.slug ?? areas[0]?.slug ?? null;

  const [changeLogs, related] = await Promise.all([
    getChangeLogs(subsidy.id),
    getRelatedSubsidies(subsidy.id, primaryAreaSlug),
  ]);

  const displayStatus = effectiveStatus(subsidy.status, subsidy.application_end_at);
  const org = subsidy.organizations;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/subsidies" className="hover:underline">
          補助金を探す
        </Link>
        <span className="mx-1.5">/</span>
        <span aria-current="page">{subsidy.title}</span>
      </nav>

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={displayStatus} />
          {areas.map((a) => (
            <span key={a!.slug} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
              {a!.name}
            </span>
          ))}
        </div>
        <FavoriteButton slug={subsidy.slug} className="h-12 w-12 shrink-0" />
      </div>

      <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{subsidy.title}</h1>
      <p className="mt-1.5 text-base text-slate-500">{org?.name ?? "実施機関未設定"}</p>
      <p className="mt-4 text-lg leading-relaxed text-slate-700">{subsidy.summary}</p>

      {/* 上限額・補助率・締切・対象地域 */}
      <dl className="mt-6 grid grid-cols-2 gap-5 rounded-xl border border-slate-200 bg-white p-6 text-base">
        <div>
          <dt className="text-slate-500">上限額</dt>
          <dd className="mt-1 text-lg font-bold text-slate-900">
            {formatAmountRange(subsidy.min_amount_yen, subsidy.max_amount_yen)}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">補助率</dt>
          <dd className="mt-1 text-lg font-bold text-slate-900">
            {subsidy.subsidy_rate_text ?? "公式ページでご確認ください"}
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-slate-500">締切</dt>
          <dd className="mt-1 text-lg font-bold">
            <DeadlineText applicationEndAt={subsidy.application_end_at} isRolling={subsidy.is_rolling} />
          </dd>
        </div>
      </dl>

      <div className="mt-10 space-y-10">
        <Section title="対象者・対象事業・対象経費">
          <TagList label="対象者" items={subsidy.applicant_types} />
          {subsidy.eligible_business_text && (
            <p className="mt-2 text-base leading-relaxed text-slate-700">{subsidy.eligible_business_text}</p>
          )}
          <TagList label="対象経費" items={subsidy.eligible_expenses} />
          {(purposeTags.length > 0 || industryTags.length > 0) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[...purposeTags, ...industryTags].map((t) => (
                <span key={t!.slug} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm text-teal-700">
                  {t!.name}
                </span>
              ))}
            </div>
          )}
        </Section>

        {subsidy.exclusion_notes && (
          <Section title="対象外・注意条件">
            <p className="text-base leading-relaxed text-slate-700">{subsidy.exclusion_notes}</p>
          </Section>
        )}

        {subsidy.application_process && (
          <Section title="申請の流れ">
            <p className="text-base leading-relaxed whitespace-pre-line text-slate-700">
              {subsidy.application_process}
            </p>
          </Section>
        )}

        {subsidy.required_documents && (
          <Section title="必要書類">
            <p className="text-base leading-relaxed text-slate-700">{subsidy.required_documents}</p>
          </Section>
        )}

        {(subsidy.contact_text || org?.contact_text) && (
          <Section title="相談窓口">
            <p className="text-base leading-relaxed text-slate-700">
              {subsidy.contact_text ?? org?.contact_text}
            </p>
          </Section>
        )}

        <Section title="公式情報">
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={subsidy.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3.5 text-base font-bold text-white hover:bg-teal-700"
            >
              公式ページで確認する
            </a>
            {subsidy.guideline_url && (
              <a
                href={subsidy.guideline_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                公募要領を見る
              </a>
            )}
          </div>
        </Section>

        <Section title="更新履歴と最終確認日時">
          <p className="text-base text-slate-700">
            最終確認日時: <span className="font-semibold">{formatJstDateTime(subsidy.verified_at)}</span>
          </p>
          {changeLogs.length > 0 && (
            <ul className="mt-3 space-y-2 border-t border-slate-100 pt-3 text-sm text-slate-500">
              {changeLogs.map((log) => (
                <li key={log.id}>
                  {formatJstDate(log.created_at)}: {log.field_name} を「{log.new_value ?? "―"}」に更新
                </li>
              ))}
            </ul>
          )}
        </Section>

        {related.length > 0 && (
          <Section title="関連制度">
            <ul className="space-y-2.5">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/subsidies/${r.slug}`} className="text-base text-teal-700 hover:underline">
                    {r.title}
                  </Link>
                  <span className="ml-2 text-sm text-slate-400">{statusLabel(r.status)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="mt-10">
        <DisclaimerNote />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

function TagList({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-base">
      <span className="text-slate-500">{label}:</span>
      {items.map((item) => (
        <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
          {item}
        </span>
      ))}
    </div>
  );
}
