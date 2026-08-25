# しまね補助金ナビ

島根県内19市町村と県・全国の補助金・助成金を、地域と目的から3分で見つけ、最新の公式情報まで迷わず確認できる検索サイト。

詳細な要件・画面・データ設計は [shimane-subsidy-site-design.md](./shimane-subsidy-site-design.md) を参照。本READMEは実装の進め方と現状を記す。

## 現在の実装範囲

**Sprint 0 + Sprint 1（公開サイトMVP）**

- Next.js App Router + TypeScript + Tailwind CSS v4
- Supabase（PostgreSQL / RLS / `search_subsidies` RPC）
- トップページ、検索一覧（複合フィルター・URL同期）、制度詳細、市町村LP、目的LP
- お気に入り（未ログイン・端末内 localStorage 保存）
- サンプルデータ 30件（島根県・しまね産業振興財団・県内市町村）

**Sprint 2（管理承認 + Jグランツ同期）**

- Supabase Auth によるメール/パスワード管理者ログイン（`/admin`、初回のみ `/admin/setup` で自己登録）
- デジタル庁 Jグランツ公開APIから島根関連制度を取得し、下書き／要確認として保存する同期機能（`/admin/ingestion`）
- 制度の分類（対象地域・目的/業種タグ）編集、公開承認、再確認、下書き却下（`/admin/subsidies`）
- 取り込み・変更履歴（`ingestion_runs` / `change_logs`）

**未実装（次Sprint以降）**: かんたん診断（Sprint 3）、業種LP・ガイド記事・更新履歴ページ、メール/LINE通知、事業者プロフィール。

## セットアップ（ローカル開発）

```bash
pnpm install
cp .env.example .env.local  # Supabaseのプロジェクト値を設定
pnpm dev
```

初回のみ、ブラウザで `http://localhost:3000/admin/setup` を開いて管理者アカウントを作成する（Supabase Auth の「Confirm email」が有効な場合は確認メールが必要。開発中は無効化を推奨 — 後述）。

### 環境変数

| 変数 | 必須 | 説明 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | SupabaseプロジェクトのAPI URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabaseの公開用（anon/publishable）キー |
| `NEXT_PUBLIC_SITE_URL` | 本番のみ | サイトの正規URL（`sitemap.xml`・`robots.txt`・OGPの絶対URL生成に使用）。未設定時は `http://localhost:3000` |
| `SUPABASE_PROJECT_ID` | 任意 | Supabase MCP等でプロジェクトを特定するための参照値。アプリコードからは参照しない |

`NEXT_PUBLIC_*` の2つ（Supabase URL・公開キー）は **公開情報**（RLSで保護されるanonキー）であり、クライアントに露出しても問題ない。秘密鍵（service role key）はどこにも使用していない。

### Supabase Auth の設定（管理者ログイン）

- 個人開発・検証段階では、Supabaseダッシュボード → Authentication → Providers → **Email** → **Confirm email** をオフにすると、確認メールなしで `/admin/setup` から即ログインできる。
- 本番運用時は「Confirm email」を有効に戻すか、カスタムSMTP（[Custom SMTP guide](https://supabase.com/docs/guides/auth/auth-smtp)）を設定することを推奨する。Supabase組み込みのメール送信は開発・検証用のベストエフォートで、1時間あたりの送信数に制限がある。

## Vercelへのデプロイ

このリポジトリはVercelでゼロコンフィグにデプロイできる標準的なNext.js App Routerアプリです。追加の`vercel.json`は不要です。

1. **GitHubリポジトリを用意**（未接続の場合）: このディレクトリをGitHubにpushし、Vercelでそのリポジトリをインポートする。
2. **Vercelプロジェクトの環境変数**に以下を設定する（Production / Preview 両方）:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` — 発行されたVercelドメイン（例: `https://shimane-subsidy-nabi.vercel.app`）または独自ドメイン
3. **ビルド設定**はデフォルトのままでよい（Framework Preset: Next.js / Build Command: `next build` / Install Command は `pnpm install` が自動検出される。`packageManager` フィールドによりpnpmバージョンも固定済み）。
4. デプロイ後、`/admin/setup` にアクセスして本番用の管理者アカウントを作成する（初回の1人だけ登録可能。以降は `/admin/login`）。
5. Supabase側で対象データベースのバックアップ設定・RLSの最終確認（`select * from pg_policies;` 等）を行う。

### デプロイ前チェックリスト

- [ ] `pnpm typecheck && pnpm lint && pnpm build` がローカルで成功する
- [ ] `pnpm test:unit` が成功する
- [ ] Vercelに3つの環境変数を設定した
- [ ] GitHubにpushする場合、`.github/workflows/ci.yml` が参照する Actions Secrets（`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`）をリポジトリ設定に追加した
- [ ] Supabase Authの「Confirm email」方針を決めた（本番はオンを推奨、または管理者を事前に作成）
- [ ] 公開したくない下書きデータがないか `/admin/subsidies?status=draft` で確認した

### 実際の公開・デプロイ実行について

本リポジトリの `CLAUDE.md` は「要件外の課金・外部送信・本番デプロイは行わない」ことを非負条件としているため、Claude Code は実際の `vercel deploy` 実行やVercelプロジェクトの新規作成は行っていない。上記手順に沿って、デプロイ自体はユーザー自身の操作で行うことを想定している。

## スクリプト

```bash
pnpm dev          # 開発サーバー
pnpm build        # 本番ビルド
pnpm start        # 本番サーバー起動
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm test:unit    # Vitest（lib/ のユニットテスト）
pnpm test:e2e     # Playwright（要: ビルド or 起動済みアプリ）
```

## アーキテクチャ

```text
app/(public)/          公開ページ（トップ・検索・詳細・市町村LP・目的LP・お気に入り）
app/admin/(auth)/       管理者ログイン・初期セットアップ
app/admin/(dashboard)/  管理ダッシュボード・制度承認・Jグランツ同期
app/api/                Route Handlers（お気に入りAPI、Jグランツ同期API）
components/             UIコンポーネント（search / subsidy / site / favorites / admin）
lib/db/                 Supabaseクライアントとクエリ関数、生成型、管理用クエリ
lib/admin/              管理者向けServer Actions（承認・分類編集）
lib/auth/               ログイン・サインアップServer Actions
lib/ingestion/          Jグランツ同期ロジック
lib/search/             検索フィルターの定数・URLパラメータのパース/組み立て
lib/                    日付・金額・ステータス・お気に入り等の共通ロジック
supabase/migrations/    適用済みマイグレーションのアーカイブ（Supabase MCPで適用）
proxy.ts                管理画面の認証ガード（Next.js 16の Proxy、旧middleware）
tests/unit/             Vitest
tests/e2e/              Playwright
```

### データと検索の仕組み

- 検索・フィルターは Postgres 関数 `search_subsidies`（`supabase/migrations/017_...sql`）に集約し、キーワード（`pg_trgm` + `ILIKE`）、地域・目的・業種タグ、対象者、募集状況、締切、金額帯、並び順、ページングを1回のRPC呼び出しで処理する。
- 締切超過時に自動で「終了」表示へ切り替える（F-07）ロジックは、SQL側（`search_subsidies`内）とTypeScript側（`lib/status.ts`の`effectiveStatus`）の両方に実装し、一覧・詳細のどちらでも一貫した表示になるようにしている。
- 下書き（`status = 'draft'`）や未公開（`published_at is null`）の制度は、RLSポリシーにより匿名キーからは取得できない。管理者（`admin_profiles`に登録されたユーザー）はRLSの `is_admin()` 判定により全件アクセスできる。

### 管理・データ取り込みの仕組み

- 管理者は Supabase Auth（メール/パスワード）でログインする。初回のみ `/admin/setup` から自己登録でき、`admin_profiles` に1件も存在しない間だけ許可される（`admin_bootstrap_available()` + RLSポリシーで制御）。
- Jグランツ同期（`/admin/ingestion` → `lib/ingestion/jgrants.ts`）はデジタル庁公開APIを直接呼び出し、新規制度は `status = 'draft'`、既存制度の変更は `data_health = 'needs_review'` として保存する。**自動取得データが承認なしに一般公開されることはない**（F-08）。
- 地域・目的/業種タグはJグランツのフリーテキストから緩やかなキーワード一致で仮付けするのみで、公開前に管理者が `/admin/subsidies/[id]` で確認・修正する運用を前提とする。

## 非負条件（設計書 §17 準拠）

- 公開制度には `official_url` と `verified_at` を必須とする
- AIで対象可否・採択可能性を断定しない
- 外部から取得したHTMLをそのまま（未サニタイズで）画面に描画しない
- 下書きは公開クエリから除外し、RLSでも保護する
- 金額は整数の円、日時はDBでUTC、表示はAsia/Tokyo
- 要件外の課金・外部送信・本番デプロイは行わない（Vercelへの実デプロイはユーザー自身が実行する）
# shimane_hozyo
