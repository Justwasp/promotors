# Pro Motors (`promotors.pt`) Implementation Plan

> **For agentic workers:** Execute task-by-task on feature branch `feat/promotors-website` (never commit directly to `main`). Follow TDD for all pure TypeScript modules and run verification (`npm test`, `npm run check`, `npm run lint`, `npm run build`) after every milestone.

**Goal:** Build and verify the bilingual (`pt-PT` + `en`) Precision Garage website for Pro Motors (`promotors.pt`) with a zero-cost Google Sheets + Gmail + Instagram Showcase backend (`google-apps-script/Code.gs`) and complete AI-agent documentation (`AGENTS.md`).

**Architecture:** Static Astro 5 site styled with Tailwind CSS v4 (`@tailwindcss/vite`) deploying to Cloudflare Pages / GitHub Pages (€0/month). All business logic (Europe/Lisbon schedule validation, WhatsApp deep-linking, Google Sheets formula-injection protection, Google Drive thumbnail normalization, booking/Instagram API clients) lives in pure unit-tested TypeScript modules under `src/lib/`. A single container-bound Google Apps Script (`google-apps-script/Code.gs`) powers the `Pedidos` mini-CRM, Gmail notifications, and `Instagram` showcase JSON feed.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), TypeScript (strict), Vitest, ESLint (`eslint-plugin-astro` + `typescript-eslint`), Google Apps Script (V8 runtime).

---

## File Map

- **Project Root & Tooling:** `package.json`, `tsconfig.json`, `astro.config.mjs`, `vitest.config.ts`, `eslint.config.mjs`, `.gitignore`, `.env.example`
- **AI-Agent & Project Docs:** `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `README.md`
- **Google Backend:** `google-apps-script/Code.gs`, `google-apps-script/SETUP.md`
- **Public Static Assets:** `public/favicon.svg`, `public/robots.txt`, `public/images/hero-motorcycle.jpg`, `public/images/work-brakes.jpg`, `public/images/work-scooter.jpg`, `public/images/work-tires.jpg`, `public/images/work-oil.jpg`
- **Config, Data, i18n:** `src/config/site.ts`, `src/data/services.ts`, `src/data/instagramFallback.ts`, `src/i18n/types.ts`, `src/i18n/pt.ts`, `src/i18n/en.ts`, `src/i18n/utils.ts`
- **Pure Logic & APIs (`src/lib/`):** `schedule.ts`, `sheetsSafety.ts`, `driveImage.ts`, `validation.ts`, `bookingApi.ts`, `instagramApi.ts`
- **Unit Tests (`src/__tests__/`):** `schedule.test.ts`, `sheetsSafety.test.ts`, `driveImage.test.ts`, `validation.test.ts`, `i18n.test.ts`, `api.test.ts`
- **UI & Pages:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/{Header,Hero,Services,InstagramShowcase,BookingForm,LocationContacts,Footer,PrivacyModal,MobileActionBar}.astro`, `src/pages/index.astro`, `src/pages/en/index.astro`

---

## Tasks

### Task 1: Project Scaffolding & Tooling
- [ ] Initialize `package.json` with Astro 5, `@tailwindcss/vite`, `tailwindcss`, `typescript`, `@astrojs/check`, `@astrojs/sitemap`, `vitest`, `jsdom`, `eslint`, `eslint-plugin-astro`, `typescript-eslint`, `globals`.
- [ ] Configure `astro.config.mjs` (`site: 'https://promotors.pt'`, `output: 'static'`, `@tailwindcss/vite`, `@astrojs/sitemap`), `tsconfig.json` (strict), `vitest.config.ts`, `eslint.config.mjs`, `.gitignore`, `.env.example`.
- [ ] Install dependencies (`npm install`) and verify `npm run check`, `npm run lint`, and `npm run build` succeed on initial skeleton.
- [ ] Commit on `feat/promotors-website`.

### Task 2: Bespoke Dark-Garage Visual Assets (`public/images/`)
- [ ] Generate 5 original royalty-free dark-garage workshop images matching the approved Precision Garage mockups:
  - `public/images/hero-motorcycle.jpg` (naked sportbike on paddock stand, right-aligned composition, dark asphalt garage lighting)
  - `public/images/work-brakes.jpg` (brake caliper & disc service close-up)
  - `public/images/work-scooter.jpg` (urban commuter scooter on lift)
  - `public/images/work-tires.jpg` (fresh motorcycle tire mounting)
  - `public/images/work-oil.jpg` (engine oil & filter service)
- [ ] Create `public/favicon.svg` and `public/robots.txt`.
- [ ] Commit assets.

### Task 3: Core Config, Typed i18n (`pt-PT` / `en`), Services Data & Pure Libraries (TDD)
- [ ] Write failing Vitest suites first for `schedule.ts`, `sheetsSafety.ts`, `driveImage.ts`, `validation.ts`, `i18n`, `bookingApi.ts`, and `instagramApi.ts`.
- [ ] Verify tests fail (`npm test`).
- [ ] Implement:
  - `src/config/site.ts` (brand facts, `Europe/Lisbon` opening hours, WhatsApp/phone/email/social/`promotorsparts.com`, `PUBLIC_GAS_WEB_APP_URL`)
  - `src/data/services.ts` (6 services) & `src/data/instagramFallback.ts` (fallback showcase)
  - `src/i18n/{types,pt,en,utils}.ts` (strictly European Portuguese `pt-PT` + English `en`)
  - `src/lib/schedule.ts` (Lisbon live open status, Sunday closed / Saturday morning-only validation, pre-filled WhatsApp message generator)
  - `src/lib/sheetsSafety.ts` (formula-injection escaping for `=`, `+`, `-`, `@`, `\t`, `\r`)
  - `src/lib/driveImage.ts` (Google Drive URL extraction → `https://lh3.googleusercontent.com/d/<ID>=w800`)
  - `src/lib/validation.ts` (booking payload validation + length caps + email/phone checks)
  - `src/lib/bookingApi.ts` (`POST` via `text/plain;charset=utf-8`, 12s AbortController timeout, graceful `NOT_CONFIGURED` / network error handling)
  - `src/lib/instagramApi.ts` (`GET ?action=instagram`, 15-min `localStorage` SWR cache, fallback resilience)
- [ ] Verify `npm test`, `npm run check`, and `npm run lint` pass 100%.
- [ ] Commit.

### Task 4: Google Apps Script Backend & Owner Setup Guide
- [ ] Create `google-apps-script/Code.gs`:
  - `setupSpreadsheet()` one-click initializer creating `Pedidos` (dropdown + color conditional formatting), `Instagram` (checkboxes + sample rows), and `Config` sheets.
  - `doGet(e)` returning active sorted Instagram showcase items with normalized Drive URLs.
  - `doPost(e)` with honeypot, elapsed-time guard (`>= 2000ms`), `CacheService` rate limiter, strict validation, `LockService` atomic ID (`PM-YYYY-XXXX`), formula-injection escaping, and quota-resilient bilingual `MailApp` emails (workshop + client confirmation).
- [ ] Create `google-apps-script/SETUP.md` (clear step-by-step setup guide for Pro Motors owners).
- [ ] Commit.

### Task 5: Precision Garage UI Components & Bilingual Pages
- [ ] Create `src/styles/global.css` with Tailwind v4 `@import "tailwindcss";`, `@theme` tokens (`#0B0D0E`, `#14181A`, `#52AF3D`), `:user-invalid`/`:user-valid` styles, `dialog:modal` + `dialog::backdrop` scroll containment, and `.visually-hidden`.
- [ ] Create `src/layouts/BaseLayout.astro` (Google Fonts `Barlow Condensed`, `Plus Jakarta Sans`, `JetBrains Mono`; canonical, `hreflang`, OpenGraph, `MotorcycleRepair` JSON-LD).
- [ ] Build modular components:
  - `Header.astro` (sticky dark nav, `PRO MOTORS` SVG wordmark, `Peças ↗`, `PT | EN`, mobile drawer)
  - `Hero.astro` (live Lisbon open/closed badge, asymmetric hero with `fetchpriority="high"` LCP image, dual CTAs, trust strip)
  - `Services.astro` (6 cards with click-to-preselect + `promotorsparts.com` banner)
  - `InstagramShowcase.astro` (`@promotorspt` grid hydrated from GAS/cache with `loading="lazy"` images)
  - `BookingForm.astro` (service chips, bike model, smart date/slot picker enforcing Mon–Fri vs Saturday & blocking Sundays, notes, contacts, RGPD checkbox, accessible `:user-invalid` + `aria-invalid`/`aria-describedby` syncing, confirmation screen with `PM-...` ID & WhatsApp button, offline/error WhatsApp recovery)
  - `LocationContacts.astro` (embedded Montijo Google Map, Google Maps/Waze links, hours, direct contact cards)
  - `Footer.astro`, `PrivacyModal.astro` (native `<dialog closedby="any">` + Safari pointer fallback), `MobileActionBar.astro`
- [ ] Wire `src/pages/index.astro` (`pt-PT`) and `src/pages/en/index.astro` (`en`).
- [ ] Verify `npm test`, `npm run check`, `npm run lint`, and `npm run build` pass cleanly.
- [ ] Commit.

### Task 6: AI-Agent Documentation & README
- [ ] Write `AGENTS.md` (architecture map, design tokens, `pt-PT` rule, GAS CORS & safety invariants, verification commands, Git/security policy, error-log section).
- [ ] Write `CLAUDE.md` and `GEMINI.md` thin pointers to `AGENTS.md`.
- [ ] Write `README.md` (local dev, testing, Cloudflare Pages / GitHub Pages deploy, GAS integration).
- [ ] Commit.

### Task 7: End-to-End Verification & Live Browser QA
- [ ] Run full verification suite: `npm test && npm run check && npm run lint && npm run build`.
- [ ] Start `npm run preview` on localhost and visually + interactively inspect both `/` (`pt-PT`) and `/en/` (`en`) at desktop (`1440×900`) and mobile (`390×844`) using the `browser` subagent:
  - Verify typography, contrast, hero image, all 6 services, Instagram showcase, map, `promotorsparts.com` link, `PT ↔ EN` switching.
  - Test clicking a service card → pre-selects chip and scrolls to booking form.
  - Test Sunday rejection and Saturday morning-only slot filtering.
  - Test RGPD Privacy modal opening and light-dismiss / close button.
  - Test booking submission (with network stub / fallback verification) → confirmation UI + pre-filled WhatsApp URL.
  - Confirm 0 console errors and 0 broken images.
- [ ] Fix any discovered issue, re-verify, and present final report to the user.
