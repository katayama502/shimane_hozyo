@AGENTS.md

# Project Rules

## Goal
島根県内の利用者が、3分以内に使える可能性のある補助金を見つけ、
必ず公式情報へ到達できるサイトを作る。

## Non-negotiables
- 公開制度には official_url と verified_at を必須とする
- AIで対象可否・採択可能性を断定しない
- 外部から取得したHTMLをそのまま（未サニタイズで）描画しない
- 取得データはZodで検証する
- 下書きは公開クエリから除外し、RLSでも保護する
- 金額は整数の円、日時はDBでUTC、表示はAsia/Tokyo
- 変更にはテストを追加し、既存テストを通す
- 要件外の課金・外部送信・本番デプロイは行わない

## Definition of Done
- typecheck / lint / test / build が成功
- モバイルとデスクトップを確認
- loading / empty / error 状態を実装
- アクセシビリティ上の重大違反がない
- docs と migration が実装に一致

## この文脈固有の注意点
- 利用者はITに不慣れな層を想定している。文字サイズ・タップ領域は大きめに保ち、
  専門用語より平易な言葉を優先する（`app/globals.css` の `html { font-size: 18px }` を基準値として扱う）。
- Next.js 16 は破壊的変更を含む可能性がある。実装前に `node_modules/next/dist/docs/` を確認する
  （`AGENTS.md` 参照）。本プロジェクトは `cacheComponents` を有効化していない
  （従来のキャッシュ/レンダリングモデルを使用）。
- 検索・フィルターのロジックは Postgres 関数 `search_subsidies` に集約している。
  フィルター項目を追加・変更する場合は、この関数と `lib/search/constants.ts` /
  `lib/search/params.ts` の両方を更新すること。
- ネイティブ `<select>`/`<input>` の GET フォーム送信では未選択項目が空文字列として
  送られる。`lib/search/params.ts` の `firstOf()` が空文字列を `undefined` に正規化しているため、
  この正規化を経由せずに検索パラメータを読み書きしない。
