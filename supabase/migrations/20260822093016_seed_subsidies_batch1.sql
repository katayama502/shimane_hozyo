insert into subsidies (
  slug, title, summary, status, data_health, applicant_types, eligible_expenses,
  subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
  application_start_at, application_end_at, official_url, guideline_url, contact_text,
  organization_id, eligible_business_text, exclusion_notes, application_process, required_documents,
  verified_at, published_at
)
select 'shimane-equipment-investment-2026', '島根県中小企業設備投資促進補助金（令和8年度）',
  '県内中小企業が行う生産性向上のための機械設備導入を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['機械設備','改修'], '対象経費の1/2以内', 5000000::bigint, null::bigint, false,
  '2026-07-01'::timestamptz, '2026-10-30'::timestamptz, 'https://www.pref.shimane.lg.jp/', null, '島根県 中小企業課 (0852-22-5288)',
  (select id from organizations where name = '島根県'),
  '県内に主たる事業所を有する中小企業者による生産性向上のための設備投資', '既存事業と関連のない新規事業への投資、中古設備の一部は対象外です。詳細は公募要領でご確認ください。',
  '公募要領確認 → 事前相談 → 電子申請 → 交付決定 → 事業実施 → 実績報告', '事業計画書、見積書、登記事項証明書、直近決算書',
  '2026-08-15'::timestamptz, '2026-08-15'::timestamptz
union all
select 'shimane-startup-support-2026', '島根県創業支援補助金（令和8年度）',
  '島根県内で新たに創業する方の初期費用を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告','専門家費用'], '対象経費の2/3以内', 2000000::bigint, null::bigint, false,
  '2026-06-01'::timestamptz, '2026-09-30'::timestamptz, 'https://www.pref.shimane.lg.jp/', null, '島根県 中小企業課',
  (select id from organizations where name = '島根県'),
  '島根県内で創業し、県内に事業所を設置する個人・法人', '創業前の個人的な生活費、フランチャイズ加盟料の一部は対象外',
  '創業計画書提出 → 審査 → 交付決定 → 創業 → 実績報告', '創業計画書、資金計画書、開業届の写し',
  '2026-08-10'::timestamptz, '2026-08-10'::timestamptz
union all
select 'shimane-dx-support-2026', '島根県IT導入・DX推進補助金（令和8年度）',
  '中小企業のITツール導入やDX推進の取り組みを支援する補助金です。', 'scheduled'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['ソフトウェア','専門家費用'], '対象経費の1/2以内', 1500000::bigint, null::bigint, false,
  '2026-10-01'::timestamptz, '2026-12-25'::timestamptz, 'https://www.pref.shimane.lg.jp/', null, '島根県 中小企業課',
  (select id from organizations where name = '島根県'),
  '生産性向上を目的にITツールを導入する県内中小企業', '汎用パソコン等の単体購入、通信費のみの申請は対象外',
  '公募開始 → 交付申請 → 審査 → 交付決定 → 導入 → 実績報告', '導入計画書、見積書、IT導入支援事業者との契約書案',
  '2026-08-05'::timestamptz, '2026-08-05'::timestamptz
union all
select 'shimane-energy-saving-2026', '島根県省エネ設備導入支援補助金（令和8年度）',
  '中小企業の省エネルギー設備導入を支援し、エネルギーコスト削減を後押しする補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主','農林水産'], array['機械設備','改修'], '対象経費の1/3以内', 3000000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-11-30'::timestamptz, 'https://www.pref.shimane.lg.jp/', null, '島根県 中小企業課',
  (select id from organizations where name = '島根県'),
  '県内で省エネ設備（高効率空調・LED照明・省エネ生産設備等）を導入する事業者', '住宅用設備、既に着工済みの工事は対象外',
  '事前エントリー → 交付申請 → 交付決定 → 設備導入 → 実績報告', '省エネ計画書、設備見積書、エネルギー使用量の分かる資料',
  '2026-07-20'::timestamptz, '2026-07-20'::timestamptz
union all
select 'shimane-business-succession-2026', '島根県事業承継支援補助金（令和8年度）',
  '中小企業の事業承継・引継ぎに伴う経費の一部を支援する補助金です。随時受付。', 'anytime'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['専門家費用','改修'], '対象経費の1/2以内', 2000000::bigint, null::bigint, true,
  null, null, 'https://www.pref.shimane.lg.jp/', null, '島根県 中小企業課',
  (select id from organizations where name = '島根県'),
  '県内で事業承継・M&Aによる経営資源の引継ぎを行う中小企業者', '親族内承継のうち専門家関与のない手続きのみの経費は対象外',
  '事前相談 → 随時申請 → 審査 → 交付決定 → 実績報告', '事業承継計画書、専門家との契約書、見積書',
  '2026-08-01'::timestamptz, '2026-08-01'::timestamptz
union all
select 'joho-shimane-sales-channel-2026', 'しまね産業振興財団 販路開拓支援助成金',
  '県内中小企業の展示会出展やECサイト構築など販路開拓の取り組みを助成します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['Web・広告','専門家費用'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-06-01'::timestamptz, '2026-10-15'::timestamptz, 'https://www.joho-shimane.or.jp/', null, 'しまね産業振興財団 経営支援部',
  (select id from organizations where name = 'しまね産業振興財団'),
  '県内に事業所を有し、新たな販路開拓に取り組む中小企業者', '既存取引先向けの通常営業活動、交際費は対象外',
  '申請 → 審査 → 交付決定 → 事業実施 → 実績報告', '事業計画書、見積書',
  '2026-08-12'::timestamptz, '2026-08-12'::timestamptz
union all
select 'joho-shimane-product-development-2026', 'しまね産業振興財団 商品開発支援助成金',
  '県内中小企業による新商品・新サービスの開発を支援する助成金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['専門家費用','機械設備'], '対象経費の1/2以内', 2000000::bigint, null::bigint, false,
  '2026-06-15'::timestamptz, '2026-10-31'::timestamptz, 'https://www.joho-shimane.or.jp/', null, 'しまね産業振興財団 経営支援部',
  (select id from organizations where name = 'しまね産業振興財団'),
  '県内資源を活用した新商品・新サービスの開発に取り組む中小企業者', '既存商品の軽微な改良のみは対象外',
  '申請 → 審査 → 交付決定 → 開発実施 → 実績報告', '商品開発計画書、見積書',
  '2026-08-08'::timestamptz, '2026-08-08'::timestamptz
union all
select 'joho-shimane-employment-2025', 'しまね産業振興財団 雇用促進奨励金（令和7年度）',
  '県内中小企業の正社員雇用を奨励する助成金です。令和7年度分は受付を終了しました。', 'closed'::subsidy_status, 'archived'::data_health,
  array['法人'], array['人件費'], '対象経費の一部', 500000::bigint, null::bigint, false,
  '2025-04-01'::timestamptz, '2026-07-31'::timestamptz, 'https://www.joho-shimane.or.jp/', null, 'しまね産業振興財団 経営支援部',
  (select id from organizations where name = 'しまね産業振興財団'),
  '令和7年度中に正社員を新規雇用した県内中小企業者（受付終了）', 'パート・アルバイト雇用、令和7年度枠終了後の申請は対象外',
  '受付終了。次年度公募は財団サイトでご確認ください。', '雇用契約書、賃金台帳（受付終了）',
  '2026-08-01'::timestamptz, '2026-08-01'::timestamptz;
