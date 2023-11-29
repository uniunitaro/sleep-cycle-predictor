<picture>
  <source media="(prefers-color-scheme: dark)" srcset="src/assets/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="src/assets/logo-light.png">
  <img alt="Sleep Predictor" src="src/assets/logo-light.png">
</picture>

[Sleep Predictor](https://www.sleep-predictor.com/)

Next.js (App Router) で作られた、非 24 時間睡眠覚醒症候群の人をサポートする睡眠サイクル予測アプリケーション。

## 使用サービス・ライブラリ

- Next.js (App Router, Edge Runtime)
- Vercel …デプロイ先
- PlanetScale …サーバーレス DB
- Drizzle ORM …Edge で動く ORM
- Cloudflare R2 …画像ストレージ
- Supabase …認証
- Chakra UI …UI ライブラリ
- Jest, React Testing Library, Playwright …テストツール

## 開発

開発サーバーを起動する

```bash
pnpm dev
```
