insert into subsidies (
  slug, title, summary, status, data_health, applicant_types, eligible_expenses,
  subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
  application_start_at, application_end_at, official_url, guideline_url, contact_text,
  organization_id, eligible_business_text, exclusion_notes, application_process, required_documents,
  verified_at, published_at
)
select 'masuda-startup-challenge-2026', '益田市創業チャレンジ支援補助金',
  '益田市内での創業を目指す方の事業計画実現を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告'], '対象経費の2/3以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-09-30'::timestamptz, 'https://www.city.masuda.lg.jp/', null, '益田市 経済部 商工課',
  (select id from organizations where name = '益田市'),
  '益田市内で新たに創業する個人・法人', '既存店舗の模様替えのみは対象外',
  '創業計画書提出 → 審査 → 交付決定 → 実績報告', '創業計画書、見積書',
  '2026-08-13'::timestamptz, '2026-08-13'::timestamptz
union all
select 'masuda-equipment-2026', '益田市中小企業設備投資支援補助金',
  '益田市内中小企業の生産性向上に資する設備投資を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['機械設備'], '対象経費の1/3以内', 2000000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-11-28'::timestamptz, 'https://www.city.masuda.lg.jp/', null, '益田市 経済部 商工課',
  (select id from organizations where name = '益田市'),
  '益田市内に事業所を有する中小企業者', '本社が市外にある事業者の市外拠点向け設備は対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '設備投資計画書、見積書',
  '2026-08-07'::timestamptz, '2026-08-07'::timestamptz
union all
select 'masuda-employment-2025', '益田市商工業活性化雇用奨励金（令和7年度）',
  '益田市内事業者の正社員雇用を奨励する制度です。令和7年度分は受付終了。', 'closed'::subsidy_status, 'archived'::data_health,
  array['法人'], array['人件費'], '対象経費の一部', 300000::bigint, null::bigint, false,
  '2025-04-01'::timestamptz, '2026-06-30'::timestamptz, 'https://www.city.masuda.lg.jp/', null, '益田市 経済部 商工課',
  (select id from organizations where name = '益田市'),
  '令和7年度中に正社員を新規雇用した益田市内事業者（受付終了）', '受付終了。次年度公募は益田市サイトでご確認ください。',
  '受付終了', '受付終了のため不要',
  '2026-07-15'::timestamptz, '2026-07-15'::timestamptz
union all
select 'oda-tourism-2026', '大田市観光誘客促進事業補助金',
  '大田市内の観光関連事業者による誘客の取り組みを支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主','NPO・団体'], array['Web・広告','専門家費用'], '対象経費の1/2以内', 800000::bigint, null::bigint, false,
  '2026-06-01'::timestamptz, '2026-10-20'::timestamptz, 'https://www.city.oda.lg.jp/', null, '大田市 産業振興部 商工観光課',
  (select id from organizations where name = '大田市'),
  '大田市内で観光誘客に取り組む事業者・団体', '既存イベントの通常運営費のみは対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '事業計画書、見積書',
  '2026-08-04'::timestamptz, '2026-08-04'::timestamptz
union all
select 'oda-akitenpo-2026', '大田市空き店舗再生支援補助金',
  '大田市中心部の空き店舗を活用して開業する事業者を支援します。', 'open'::subsidy_status, 'needs_review'::data_health,
  array['個人事業主','創業予定'], array['改修'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-11-30'::timestamptz, 'https://www.city.oda.lg.jp/', null, '大田市 産業振興部 商工観光課',
  (select id from organizations where name = '大田市'),
  '大田市中心市街地の空き店舗に出店する事業者', '住居専用での利用は対象外',
  '申請 → 現地確認 → 交付決定 → 実績報告', '出店計画書、賃貸借契約書案',
  '2026-04-20'::timestamptz, '2026-04-20'::timestamptz
union all
select 'yasugi-monozukuri-2026', '安来市ものづくり企業設備投資補助金',
  '安来市内の製造業者による生産設備の導入・更新を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人'], array['機械設備'], '対象経費の1/3以内', 3000000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-11-30'::timestamptz, 'https://www.city.yasugi.shimane.jp/', null, '安来市 産業振興部 商工観光課',
  (select id from organizations where name = '安来市'),
  '安来市内に生産拠点を有する製造業者', '本社機能のみの移転に伴う設備は対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '設備投資計画書、見積書、決算書',
  '2026-08-06'::timestamptz, '2026-08-06'::timestamptz
union all
select 'gotsu-startup-2026', '江津市創業支援補助金',
  '江津市内で創業する方の店舗準備費用等を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告'], '対象経費の2/3以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-10-31'::timestamptz, 'https://www.city.gotsu.lg.jp/', null, '江津市 産業振興課',
  (select id from organizations where name = '江津市'),
  '江津市内で新たに創業する個人・法人', '既存事業の看板変更のみは対象外',
  '創業計画書提出 → 審査 → 交付決定 → 実績報告', '創業計画書、見積書',
  '2026-08-02'::timestamptz, '2026-08-02'::timestamptz
union all
select 'unnan-business-succession-2026', '雲南市中山間地域事業承継支援補助金',
  '雲南市内中山間地域の事業者の円滑な事業承継を支援します。随時受付。', 'anytime'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['専門家費用'], '対象経費の1/2以内', 1000000::bigint, null::bigint, true,
  null, null, 'http://www.city.unnan.shimane.jp/unnan/', null, '雲南市 商工観光課',
  (select id from organizations where name = '雲南市'),
  '雲南市中山間地域に事業所を有する中小企業者', '市外への事業移転を伴う承継は対象外',
  '事前相談 → 随時申請 → 審査 → 交付決定 → 実績報告', '事業承継計画書、専門家契約書',
  '2026-07-28'::timestamptz, '2026-07-28'::timestamptz
union all
select 'okuizumo-agri-forestry-2026', '奥出雲町農林業機械導入支援補助金',
  '奥出雲町内の農林業者による機械・施設の導入を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['農林水産'], array['機械設備'], '対象経費の1/3以内', 1500000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-11-20'::timestamptz, 'https://www.town.okuizumo.shimane.jp/', null, '奥出雲町 産業振興課',
  (select id from organizations where name = '奥出雲町'),
  '奥出雲町内で農林業を営む事業者', '個人消費用の小型機械は対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '事業計画書、見積書',
  '2026-08-09'::timestamptz, '2026-08-09'::timestamptz;
