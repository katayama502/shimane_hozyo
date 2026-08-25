insert into subsidies (
  slug, title, summary, status, data_health, applicant_types, eligible_expenses,
  subsidy_rate_text, max_amount_yen, min_amount_yen, is_rolling,
  application_start_at, application_end_at, official_url, guideline_url, contact_text,
  organization_id, eligible_business_text, exclusion_notes, application_process, required_documents,
  verified_at, published_at
)
select 'matsue-shokibo-jizoku-2026', '松江市小規模事業者持続化支援補助金',
  '松江市内の小規模事業者が行う販路開拓・業務効率化の取り組みを支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['個人事業主','法人'], array['Web・広告','機械設備'], '対象経費の2/3以内', 500000::bigint, null::bigint, false,
  '2026-07-01'::timestamptz, '2026-09-30'::timestamptz, 'https://www.city.matsue.lg.jp/', null, '松江市 産業経済部 商工企業立地課',
  (select id from organizations where name = '松江市'),
  '松江市内に主たる事業所を有する小規模事業者', '大規模小売店舗等、常時使用従業員が一定数を超える事業者は対象外',
  '申請 → 審査 → 交付決定 → 事業実施 → 実績報告', '経営計画書、補助事業計画書、見積書',
  '2026-08-14'::timestamptz, '2026-08-14'::timestamptz
union all
select 'matsue-startup-2026', '松江市創業促進補助金',
  '松江市内で創業する方の店舗改装費・広告費等を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-09-05'::timestamptz, 'https://www.city.matsue.lg.jp/', null, '松江市 産業経済部 商工企業立地課',
  (select id from organizations where name = '松江市'),
  '松江市内で新たに創業し、事業所を構える予定の方', '既存事業の名義変更のみの場合は対象外',
  '創業計画書提出 → 審査 → 交付決定 → 創業 → 実績報告', '創業計画書、開業届の写し、見積書',
  '2026-08-14'::timestamptz, '2026-08-14'::timestamptz
union all
select 'matsue-akitenpo-2026', '松江市空き店舗活用支援補助金',
  '松江市中心市街地の空き店舗への出店を支援する補助金です。', 'scheduled'::subsidy_status, 'verified'::data_health,
  array['個人事業主','法人','創業予定'], array['改修','機械設備'], '対象経費の1/2以内', 1500000::bigint, null::bigint, false,
  '2026-10-01'::timestamptz, '2027-01-31'::timestamptz, 'https://www.city.matsue.lg.jp/', null, '松江市 産業経済部 商工企業立地課',
  (select id from organizations where name = '松江市'),
  '松江市が指定する中心市街地エリアの空き店舗に出店する事業者', '風俗営業等法令で定める業種は対象外',
  '公募開始 → 現地確認 → 交付決定 → 出店 → 実績報告', '出店計画書、賃貸借契約書案、店舗写真',
  '2026-08-10'::timestamptz, '2026-08-10'::timestamptz
union all
select 'matsue-tourism-equipment-2026', '松江市観光関連事業者設備投資補助金',
  '松江市内の宿泊・観光関連事業者による設備投資を支援します。', 'open'::subsidy_status, 'needs_review'::data_health,
  array['法人','個人事業主'], array['機械設備','改修'], '対象経費の1/3以内', 3000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-10-31'::timestamptz, 'https://www.city.matsue.lg.jp/', null, '松江市 産業経済部 商工企業立地課',
  (select id from organizations where name = '松江市'),
  '松江市内で宿泊業・観光関連サービス業を営む事業者', '個人利用目的の設備は対象外',
  '申請 → 審査 → 交付決定 → 設備導入 → 実績報告', '事業計画書、見積書、許認可証の写し',
  '2026-05-01'::timestamptz, '2026-05-01'::timestamptz
union all
select 'izumo-it-dx-2026', '出雲市中小企業IT導入支援補助金',
  '出雲市内中小企業のITツール導入による業務効率化を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['ソフトウェア'], '対象経費の1/2以内', 800000::bigint, null::bigint, false,
  '2026-06-01'::timestamptz, '2026-10-15'::timestamptz, 'https://www.city.izumo.shimane.jp/www/index.html', null, '出雲市 産業振興部 商工振興課',
  (select id from organizations where name = '出雲市'),
  '出雲市内に事業所を有する中小企業者', '個人使用目的の端末購入は対象外',
  '申請 → 審査 → 交付決定 → 導入 → 実績報告', '導入計画書、見積書',
  '2026-08-11'::timestamptz, '2026-08-11'::timestamptz
union all
select 'izumo-startup-2026', '出雲市創業支援補助金',
  '出雲市内での創業に伴う初期費用の一部を補助します。', 'open'::subsidy_status, 'verified'::data_health,
  array['創業予定','個人事業主'], array['改修','Web・広告','専門家費用'], '対象経費の2/3以内', 1000000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-09-25'::timestamptz, 'https://www.city.izumo.shimane.jp/www/index.html', null, '出雲市 産業振興部 商工振興課',
  (select id from organizations where name = '出雲市'),
  '出雲市内で新たに創業する個人・法人', '創業前の生活費相当の支出は対象外',
  '創業計画書提出 → 審査 → 交付決定 → 実績報告', '創業計画書、資金計画書',
  '2026-08-06'::timestamptz, '2026-08-06'::timestamptz
union all
select 'izumo-agri-equipment-2026', '出雲市農業経営基盤強化支援事業補助金',
  '出雲市内農業者の経営基盤強化に資する機械・施設整備を支援します。随時受付。', 'anytime'::subsidy_status, 'verified'::data_health,
  array['農林水産','個人事業主'], array['機械設備'], '対象経費の1/3以内', 2000000::bigint, null::bigint, true,
  null, null, 'https://www.city.izumo.shimane.jp/www/index.html', null, '出雲市 産業振興部 商工振興課',
  (select id from organizations where name = '出雲市'),
  '出雲市内で農業を営む認定農業者等', '中古機械の一部、個人消費用施設は対象外',
  '随時申請 → 審査 → 交付決定 → 実績報告', '経営改善計画書、見積書',
  '2026-07-25'::timestamptz, '2026-07-25'::timestamptz
union all
select 'hamada-fishery-2026', '浜田市水産業経営力強化支援補助金',
  '浜田市内の水産業者による漁具・設備整備を支援します。', 'open'::subsidy_status, 'verified'::data_health,
  array['農林水産'], array['機械設備'], '対象経費の1/3以内', 1500000::bigint, null::bigint, false,
  '2026-05-01'::timestamptz, '2026-10-31'::timestamptz, 'https://www.city.hamada.shimane.jp/www/index.html', null, '浜田市 産業経済部 商工観光課',
  (select id from organizations where name = '浜田市'),
  '浜田市内に主たる漁業拠点を有する漁業者・水産加工業者', '娯楽用船舶の整備は対象外',
  '申請 → 審査 → 交付決定 → 実績報告', '事業計画書、見積書、漁業許可証の写し',
  '2026-08-09'::timestamptz, '2026-08-09'::timestamptz
union all
select 'hamada-sales-channel-2026', '浜田市中小企業販路開拓支援補助金',
  '浜田市内中小企業の展示会出展やオンライン販売開始を支援します。', 'scheduled'::subsidy_status, 'verified'::data_health,
  array['法人','個人事業主'], array['Web・広告'], '対象経費の1/2以内', 600000::bigint, null::bigint, false,
  '2026-10-01'::timestamptz, '2026-12-20'::timestamptz, 'https://www.city.hamada.shimane.jp/www/index.html', null, '浜田市 産業経済部 商工観光課',
  (select id from organizations where name = '浜田市'),
  '浜田市内に事業所を有する中小企業者', '通常のホームページ保守費用のみの申請は対象外',
  '公募開始 → 申請 → 審査 → 交付決定 → 実績報告', '販路開拓計画書、見積書',
  '2026-08-03'::timestamptz, '2026-08-03'::timestamptz
union all
select 'hamada-akiya-migration-2026', '浜田市空き家活用移住促進補助金',
  '浜田市内の空き家を改修して移住・開業する方を支援する補助金です。', 'open'::subsidy_status, 'verified'::data_health,
  array['個人・世帯','創業予定'], array['改修'], '対象経費の1/2以内', 1000000::bigint, null::bigint, false,
  '2026-04-01'::timestamptz, '2026-12-25'::timestamptz, 'https://www.city.hamada.shimane.jp/www/index.html', null, '浜田市 産業経済部 商工観光課',
  (select id from organizations where name = '浜田市'),
  '浜田市の空き家バンク登録物件へ移住・開業する方', '賃貸目的のみで自ら居住・営業しない場合は対象外',
  '空き家バンク登録確認 → 申請 → 交付決定 → 改修 → 実績報告', '改修計画書、見積書、空き家バンク登録証',
  '2026-08-02'::timestamptz, '2026-08-02'::timestamptz;
