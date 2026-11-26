# Pro Motors (`promotors.pt`)

Bilingual (`pt-PT` + `en`) website for **Pro Motors** — motorcycle & scooter mechanics workshop in Montijo, Portugal (`R. Joaquim de Almeida, 90A, 2870-342 Montijo`).

Built for **€0/month** ongoing operation:
- **Frontend:** Astro 5 + Tailwind CSS v4 + TypeScript (static `dist/` deployable to Cloudflare Pages / GitHub Pages).
- **Backend (in Pro Motors' Google Account):** Google Apps Script (`google-apps-script/Code.gs`) connected to a Google Sheet (`Pedidos` mini-CRM + `Instagram` showcase CMS) and Gmail notifications (`MailApp`).

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:4321/` (`pt-PT`) or `http://localhost:4321/en/` (`en`).

## Connecting Google Sheets, Gmail & Instagram Showcase

Follow the 5-minute guide in [`google-apps-script/SETUP.md`](google-apps-script/SETUP.md) to:
1. Create the Google Sheet and run `setupSpreadsheet()` once.
2. Deploy `google-apps-script/Code.gs` as a Web App (`Execute as: Me`, `Access: Anyone`).
3. Set `PUBLIC_GAS_WEB_APP_URL` in Cloudflare Pages / GitHub Actions (or local `.env`) and rebuild.

## Verification

```bash
npm test
npm run check
npm run lint
npm run build
```

## Documentation for AI Agents & Developers

- [`AGENTS.md`](AGENTS.md) — architecture map, design tokens, technical invariants, verification commands, and error log.
- [`docs/superpowers/specs/2026-11-25-promotors-site-design.md`](docs/superpowers/specs/2026-11-25-promotors-site-design.md) — full design specification and approved visual mockups.
