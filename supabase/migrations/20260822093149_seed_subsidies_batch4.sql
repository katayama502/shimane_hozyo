insert into subsidies (
  slug, title, summary, status, data_health, applicant_types, eligible_expenses,
  subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
  application_start_at, application_end_at, official_url, guideline_url, contact_text,
  organization_id, eligible_business_text, exclusion_notes, application_process, required_documents,
  verified_at, published_at
)
select 'tsuwano-migration-housing-2026', '津和野町移住定住促進住宅改修補助金',
  '津和野町へ移住し空き家等に定住する方の住宅改修費用を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['個人・世帯'], array['改修'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-12-25'::timestamptz, 'https://www.town.tsuwano.lg.jp/www/index.html', null, '津和野町 産業建設課',
  (select id from organizations where name = '津和野町'),
  '津和野町へ転入し、町内の住宅に定住する方', '賃貸目的のみでの改修は対象外',
  '申請 → 現地確認 → 交付決定 → 改修 → 実績報告', '定住計画書、見積書、住民票',
  '2026-08-01'::timestamptz, '2026-08-01'::timestamptz
union all
select 'okinoshima-tourism-2026', '隠岐の島町観光地域づくり支援補助金',
  '隠岐の島町内の観光関連事業者・団体による地域づくりの取り組みを支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','NPO・団体','個人事業主'], array['Web・広告','専門家費用'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-06-01'::timestamptz, '2026-11-30'::timestamptz, 'https://www.town.okinoshima.shimane.jp/www/index.html', null, '隠岐の島町 産業振興課',
  (select id from organizations where name = '隠岐の島町'),
  '隠岐の島町内で観光地域づくりに取り組む事業者・団体', '個人旅行の費用は対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '事業計画書、見積書',
  '2026-08-05'::timestamptz, '2026-08-05'::timestamptz
union all
select 'ama-startup-2026', '海士町ないものはない起業支援補助金',
  '海士町で新たに起業する方の初期費用を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告','専門家費用'], '対象経費の2/3以内', 1500000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-10-31'::timestamptz, 'http://www.town.ama.shimane.jp/', null, '海士町 地産地商課',
  (select id from organizations where name = '海士町'),
  '海士町内で新たに起業し、町内に事業所を構える方', '町外への転出を予定している場合は対象外',
  '起業相談 → 計画書提出 → 審査 → 交付決定 → 実績報告', '起業計画書、見積書',
  '2026-08-11'::timestamptz, '2026-08-11'::timestamptz;
