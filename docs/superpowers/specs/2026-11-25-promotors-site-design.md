# Pro Motors (`promotors.pt`) — Website Design & Architecture Specification

**Date:** 2026-11-25  
**Status:** Draft for User Review  
**Branch:** `feat/promotors-website`  
**Target Domain:** `https://promotors.pt/`

---

## 1. Executive Summary & Goals

Replace the existing WordPress "EM BREVE" placeholder at `https://promotors.pt/` with a fast, high-contrast, bilingual (`pt-PT` + `en`) website for **Pro Motors** (motorcycle & scooter repair/maintenance workshop in Montijo, Portugal) at **€0/month** ongoing hosting and backend cost.

### Primary Goals
1. **Service Booking Intake:** Let riders book maintenance and repair appointments (multi-select services, motorcycle/scooter make & model, preferred date & time window, notes, contact details, RGPD consent).
2. **Google-Account Native Storage & Notifications (€0/month):** Persist every booking into the workshop's own **Google Sheets** mini-CRM (`Pedidos`), send instant HTML notifications to `geral@promotors.pt` via **Gmail** (`MailApp`), and send a localized auto-confirmation email to the customer.
3. **Zero-Breakage Instagram Integration (`@promotorspt`):** Display a curated gallery of recent workshop jobs managed directly in the same **Google Sheet** (`Instagram`) with images hosted on **Google Drive** (or direct URLs) and deep links to `@promotorspt` posts — avoiding Meta Graph API token expiration issues while remaining 100% free.
4. **WhatsApp Conversion Assist:** After saving a booking to Google, present a confirmation screen with booking ID (`PM-YYYY-XXXX`) and a one-click pre-filled WhatsApp confirmation button (`+351 968 505 075`).
5. **Parts Shop Cross-Link:** Include clear navigation/footer links to the workshop's parts store (`https://promotorsparts.com/`).
6. **AI-Agent Readiness:** Ship clean project documentation (`AGENTS.md` + `CLAUDE.md`/`GEMINI.md` pointers) so future human developers and AI agents can safely evolve the codebase without breaking design or Google Apps Script invariants.

### Non-Goals (YAGNI for v1)
- No e-commerce checkout, shopping cart, or online payment gateway.
- No live Meta Instagram Graph API OAuth/token cron pipeline.
- No dynamic pricing/services CMS in Google Sheets (services are versioned in typed `src/data/services.ts` + i18n dictionaries).
- No Google Calendar automatic slot locking or customer photo uploads to Google Drive in v1.

---

## 2. Business Context & Verified Brand Data

- **Brand Name:** Pro Motors (wordmark: `PRO` in `#52AF3D` + `MOTORS` in `#FFFFFF` on dark surfaces)
- **Specialization:** Multi-brand motorcycle & scooter mechanics, periodic maintenance, oil/filters, brakes, tires, transmission, and urban/delivery scooter servicing
- **Address:** R. Joaquim de Almeida, 90A, 2870-342 Montijo, Portugal (Junto à PSP)
- **Opening Hours (`Europe/Lisbon`):**
  - Monday–Friday: `09:00–19:00`
  - Saturday: `09:00–13:00`
  - Sunday: Closed
- **Phone:** `+351 212 314 830` (`tel:+351212314830`)
- **WhatsApp:** `+351 968 505 075` (`https://wa.me/351968505075`)
- **Email:** `geral@promotors.pt`
- **Social & Related Links:**
  - Instagram: `https://www.instagram.com/promotorspt/` (`@promotorspt`)
  - Facebook: `https://www.facebook.com/promotorspt`
  - Parts Shop: `https://promotorsparts.com/`

### Language Standards
- **Default route (`/`):** Clean, idiomatic **European Portuguese (`pt-PT`)** — e.g. *Marcação, Telemóvel, Morada, Revisão, Estamos a trabalhar*. Never mix Brazilian Portuguese (`pt-BR`) phrasing.
- **Secondary route (`/en/`):** Natural **English (`en`)** for expats, commuters, and delivery riders in Greater Lisbon/Montijo.

---

## 3. Visual Design System ("Precision Garage")

Approved visual references:
- Hero & Services mockup: [design-hero-services.jpg](assets/design-hero-services.jpg)
- Instagram Showcase & Booking mockup: [design-instagram-booking.jpg](assets/design-instagram-booking.jpg)

### Color Tokens (WCAG AA+ Contrast)
| Role | Token | Value | Usage |
| :--- | :--- | :--- | :--- |
| Primary Background | `--bg-asphalt` | `#0B0D0E` | Page canvas |
| Card / Panel Surface | `--bg-carbon` | `#14181A` | Cards, booking container, navbar |
| Elevated Input / Hover | `--bg-carbon-elevated` | `#1C2124` | Form fields, hover surfaces |
| Subtle Border | `--border-steel` | `rgba(255, 255, 255, 0.08)` | Hairline borders |
| Brand Accent | `--brand-green` | `#52AF3D` | `PRO` wordmark, primary CTAs, active chips, status dot |
| Brand Accent Hover | `--brand-green-hover` | `#63C74D` | Button hover state |
| Brand Accent Tint | `--brand-green-soft` | `rgba(82, 175, 61, 0.14)` | Badges, subtle highlights |
| Primary Text | `--text-primary` | `#F5F7F6` | Headings, body copy |
| Secondary Text | `--text-secondary` | `#9BA6A1` | Subtitles, metadata, helper copy |
| Warning / Closed | `--status-warning` | `#F59E0B` | Closed status / validation warnings |
| Error | `--status-error` | `#EF4444` | Form errors |

### Typography
- **Display / Headings:** `Barlow Condensed` (700/800, uppercase for hero & section headlines)
- **Body / UI:** `Plus Jakarta Sans` (400/500/600/700)
- **Monospace Metadata:** `JetBrains Mono` (400/500 for section eyebrows `// SERVIÇOS`, booking IDs `PM-2026-0014`, opening hours)

### Page Structure & UX Flow
1. **Sticky Header (`Header.astro`):**
   - Inline SVG `PRO MOTORS` wordmark (returns to top of current locale).
   - Anchor links: `Serviços / Services`, `Instagram`, `Marcação / Booking`, `Contactos / Contacts`, external link `Peças ↗ / Parts ↗` (`https://promotorsparts.com/`).
   - Locale switcher `PT | EN` linking cleanly between `/` and `/en/`.
   - Primary CTA button `Marcar Serviço / Book Service` + accessible mobile drawer.
2. **Hero (`Hero.astro`):**
   - Live open/closed status pill computed client-side in `Europe/Lisbon` time (`Aberto agora` / `Fechado` + hours).
   - Asymmetric editorial split: high-contrast typography on `#0B0D0E` left, atmospheric dark motorcycle workshop visual on right with seamless gradient scrim (`linear-gradient`) guaranteeing text legibility on all viewports.
   - Primary CTA (`Marcar Serviço` → smooth scroll to `#marcacao`) + Secondary CTA (`WhatsApp Direto`).
   - Compact trust strip: `Multimarca · Montijo (Junto à PSP) · Motos & Scooters`.
3. **Services (`Services.astro`):**
   - 6 carbon cards in a responsive 3×2 desktop / 2×3 tablet / 1×6 mobile grid:
     1. `revisao`: Revisão Geral & Manutenção / Full Service & Maintenance
     2. `oleo`: Mudança de Óleo & Filtros / Oil & Filter Change
     3. `travoes`: Travões — Pastilhas, Discos & Maxilas / Brakes — Pads, Discs & Calipers
     4. `pneus`: Pneus — Venda & Montagem / Tires — Sales & Fitting
     5. `mecanica`: Transmissão & Mecânica Geral / Drivetrain & General Mechanics
     6. `scooters`: Scooters & Motas de Entregas / Scooters & Delivery Fleet Care
   - Clicking any card pre-selects that service chip in the booking form and smoothly scrolls to `#marcacao`.
   - Compact bottom strip linking to `https://promotorsparts.com/` for spare parts and accessories.
4. **Instagram & Workshop Showcase (`InstagramShowcase.astro`):**
   - Header with `// INSTAGRAM · @PROMOTORSPT`, section title, and `Seguir @promotorspt ↗` button.
   - Responsive grid (up to 8 cards, 4 columns on desktop, 2 on mobile) of square/4:5 dark workshop cards with green category badge, localized caption, and Instagram deep link (`target="_blank" rel="noopener noreferrer"`).
   - Hydrates from Google Apps Script `GET ?action=instagram` using stale-while-revalidate `localStorage` cache (15-minute TTL) with bundled fallback items so initial paint is instant and never empty.
5. **Online Booking (`BookingForm.astro`):**
   - **Service chips (multi-select, at least 1 required):** synced with the 6 services above.
   - **Bike / Scooter field (required):** free text (`e.g. Honda PCX 125 / Yamaha MT-07`).
   - **Preferred Date (required):** `min` = today in `Europe/Lisbon`; client & server reject past dates and Sundays (`day === 0`).
   - **Time Window (required):** dynamically filtered by selected day:
     - Mon–Fri: `Manhã (09:00–13:00)` | `Tarde (14:00–19:00)`
     - Saturday: `Manhã (09:00–13:00)` only (afternoon automatically disabled/cleared with helper note)
   - **Notes / Symptoms (optional):** textarea up to 800 characters.
   - **Contact Details (required):** Name, Phone/WhatsApp, Email.
   - **RGPD Consent Checkbox (required):** explicit consent linking to built-in Privacy Policy modal (`PrivacyModal.astro`).
   - **Hidden Anti-Spam Fields:** honeypot input `website` + form mount timestamp (`startedAt`).
   - **Success State:** replaces form smoothly with confirmation panel displaying monospace ID (`PM-YYYY-XXXX`), booking summary, email confirmation notice, bright green **`Confirmar também no WhatsApp`** button (pre-filled `wa.me/351968505075?text=...` message), and option to submit another booking.
   - **Error / Offline Fallback State:** displays clear localized error + **`Enviar diretamente por WhatsApp`** button pre-filled with the exact form values so zero leads are ever lost.
6. **Location, Contacts & Footer (`LocationContacts.astro`, `Footer.astro`, `MobileActionBar.astro`):**
   - Embedded Google Maps iframe for `R. Joaquim de Almeida, 90A, 2870-342 Montijo` (free embed, no API key required) + direct Google Maps / Waze links.
   - Opening hours, clickable phone, WhatsApp, email, Instagram, Facebook, `promotorsparts.com`.
   - Footer with Privacy Policy (RGPD) trigger and configurable `livroReclamacoesUrl` slot.
   - Sticky bottom action bar on mobile (`< 768px`): Call · WhatsApp · Book.

---

## 4. Technical Architecture & Module Boundaries

### Frontend Stack
- **Framework:** Astro 5 (`output: 'static'`) + Tailwind CSS v4 + TypeScript (strict mode)
- **Hosting (€0/month):** Static `dist/` build deployable to **Cloudflare Pages**, **GitHub Pages**, or any static web host, bound to custom domain `promotors.pt`.
- **SEO & Local Search:**
  - Dedicated static routes `/` (`pt-PT`) and `/en/` (`en`) with `<link rel="alternate" hreflang="pt-PT" ...>`, `hreflang="en"`, `hreflang="x-default"`, canonical URLs, OpenGraph/Twitter tags, `robots.txt`, and static `sitemap.xml`.
  - JSON-LD `AutoRepair` / `MotorcycleRepair` structured data with address, geo/Montijo locality, phone, opening hours, and `sameAs` links.

### Directory Layout
```text
promotors/
├── AGENTS.md                        # Master documentation for AI agents & developers
├── CLAUDE.md                        # Thin pointer to AGENTS.md
├── GEMINI.md                        # Thin pointer to AGENTS.md
├── .env.example                     # PUBLIC_GAS_WEB_APP_URL= (never commit real secrets)
├── astro.config.mjs
├── eslint.config.mjs
├── vitest.config.ts
├── docs/
│   └── superpowers/specs/           # Design spec + approved visual mockups
├── google-apps-script/
│   ├── Code.gs                      # Complete GAS Web App (Pedidos CRM + Gmail + Instagram API)
│   └── SETUP.md                     # 5-minute owner setup guide (PT + RU/EN)
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/                      # Optimized local hero & fallback workshop photography
└── src/
    ├── config/
    │   └── site.ts                  # Single source of truth for brand, schedule, links, env URL
    ├── data/
    │   ├── services.ts              # Canonical 6 service definitions (IDs + icon keys)
    │   └── instagramFallback.ts     # Curated local fallback showcase items
    ├── i18n/
    │   ├── types.ts                 # Shared strongly-typed translation interface
    │   ├── pt.ts                    # European Portuguese (pt-PT) dictionary
    │   ├── en.ts                    # English (en) dictionary
    │   └── utils.ts                 # Locale helpers
    ├── lib/
    │   ├── schedule.ts              # Europe/Lisbon open status, date/slot validation, WhatsApp URL
    │   ├── validation.ts            # Booking payload validation & sanitization
    │   ├── sheetsSafety.ts          # Google Sheets formula-injection neutralization
    │   ├── driveImage.ts            # Google Drive share URL → lh3 thumbnail normalizer
    │   ├── bookingApi.ts            # POST client (text/plain CORS-safe, 12s timeout)
    │   └── instagramApi.ts          # GET ?action=instagram + localStorage SWR cache + fallback
    ├── components/
    │   ├── Header.astro
    │   ├── Hero.astro
    │   ├── Services.astro
    │   ├── InstagramShowcase.astro
    │   ├── BookingForm.astro
    │   ├── LocationContacts.astro
    │   ├── Footer.astro
    │   ├── PrivacyModal.astro
    │   └── MobileActionBar.astro
    ├── layouts/
    │   └── BaseLayout.astro         # HTML shell, fonts, SEO meta, hreflang, JSON-LD
    ├── styles/
    │   └── global.css               # Tailwind v4 + custom Precision Garage tokens
    ├── pages/
    │   ├── index.astro              # pt-PT landing page
    │   └── en/
    │       └── index.astro          # en landing page
    └── __tests__/                   # Vitest unit test suites
```

---

## 5. Google Account Backend (`google-apps-script/Code.gs`)

Everything runs inside **Pro Motors' own Google Account** as a container-bound Apps Script attached to a single Google Spreadsheet (`Pro Motors — Gestão Site`).

### Spreadsheet Schema (Auto-Created by `setupSpreadsheet()`)
1. **Sheet `Pedidos` (Mini-CRM):**
   `ID | DataRegisto | Estado | Servicos | Moto | DataPreferida | Horario | Nome | Telefone | Email | Observacoes | Idioma | NotasOficina`
   - `Estado` has data validation dropdown (`Novo`, `Confirmado`, `Em curso`, `Concluído`, `Cancelado`) and conditional formatting colors.
   - `ID` format: `PM-YYYY-XXXX` generated sequentially inside `LockService.getScriptLock()` (`waitLock(10000)`) to prevent race-condition duplicates.
2. **Sheet `Instagram` (Showcase CMS):**
   `Ativo | Ordem | Categoria_PT | Categoria_EN | Legenda_PT | Legenda_EN | ImagemURL | InstagramURL`
   - `Ativo` formatted as native Google Sheets checkboxes.
   - `ImagemURL` accepts either a standard Google Drive share link (`https://drive.google.com/file/d/<ID>/view?...`, `open?id=<ID>`, `uc?id=<ID>`) — automatically normalized to `https://lh3.googleusercontent.com/d/<ID>=w800` — or any direct HTTPS image URL.
3. **Sheet `Config`:**
   Key-value pairs: `WORKSHOP_EMAIL` (`geral@promotors.pt`), `SEND_CLIENT_CONFIRMATION` (`TRUE`), `MAX_INSTAGRAM_ITEMS` (`8`).

### Endpoints & CORS Contract
- **`GET <WEB_APP_URL>?action=instagram`**
  - Returns `application/json`: `{ ok: true, items: InstagramItem[], updatedAt: string }`.
  - Filters rows where `Ativo === true`, sorts ascending by `Ordem`, normalizes `ImagemURL`, caps at `MAX_INSTAGRAM_ITEMS`.
- **`POST <WEB_APP_URL>`**
  - Frontend MUST send `Content-Type: text/plain;charset=utf-8` with `JSON.stringify(payload)` body so browsers skip `OPTIONS` CORS preflight (unsupported by Google Apps Script Web Apps).
  - Server parses `JSON.parse(e.postData.contents)`.
  - **Anti-Spam Pipeline:**
    1. If honeypot `website` is non-empty → silently return `{ ok: true, bookingId: 'PM-OK', ignored: true }` without writing or emailing.
    2. If submission elapsed time `< 2000ms` → reject with `400`-equivalent JSON `{ ok: false, error: 'TOO_FAST' }`.
    3. Rate limit via `CacheService.getScriptCache()` keyed by normalized phone/email hash: max 3 bookings per 10 minutes (`RATE_LIMITED`).
    4. Server-side field validation (services non-empty, valid bike/name/phone/email, valid non-Sunday date, valid time slot for weekday vs Saturday, `gdprAccepted === true`, length caps).
    5. Formula-injection sanitization before writing to cells: any string starting with `=`, `+`, `-`, `@`, `\t`, or `\r` is prefixed with `'` (single quote) so Google Sheets stores literal text (especially critical for `+351...` phone numbers!).
  - **Email Notifications (`MailApp.sendEmail`):**
    - Checks `MailApp.getRemainingDailyQuota()` first.
    - **Workshop Email:** sent to `WORKSHOP_EMAIL` with `replyTo: payload.email`, subject `[Pro Motors] Nova marcação PM-YYYY-XXXX — <Moto> (<Data>)`, formatted HTML summary, and direct `Responder no WhatsApp` link.
    - **Client Auto-Confirmation Email:** if `SEND_CLIENT_CONFIRMATION === 'TRUE'` and quota permits, sent in `payload.lang` (`pt` or `en`) containing `bookingId`, booking summary, workshop address/hours, and explicit notice that the booking awaits workshop confirmation of slot availability.
    - **Quota Resilience:** if Gmail daily quota is exhausted, the booking row is **still saved** in `Pedidos` and the endpoint returns `{ ok: true, bookingId, emailSent: false }` so no order is ever dropped.

### Graceful Degradation When `PUBLIC_GAS_WEB_APP_URL` Is Unset
Before Pro Motors completes the 5-minute Apps Script setup (or during local previews without a live GAS endpoint):
- **Instagram Showcase:** skips network fetch and renders bundled `src/data/instagramFallback.ts` cards with zero console errors.
- **Booking Form:** returns a structured `NOT_CONFIGURED` state that surfaces the localized WhatsApp recovery CTA pre-filled with the user's entered booking details so no visitor ever hits a dead end.

### Local Visual Assets (`public/images/`)
To avoid stock-photo licensing issues and guarantee cohesive dark-garage art direction matching the approved mockups, bespoke royalty-free photography (hero motorcycle on paddock stand + 6 workshop service/Instagram fallback photos) will be generated and optimized locally into `public/images/`. Once Pro Motors connects their Google Sheet `Instagram` tab, their own Google Drive photos replace the fallback cards automatically.

---

## 6. AI-Agent Documentation Plan

To make future development effortless and safe for AI coding agents and human contributors, the repository will include:

1. **`AGENTS.md` (Single Source of Truth at repo root):**
   - Project overview, live domain (`promotors.pt`), business facts, and brand design tokens (`#0B0D0E`, `#14181A`, `#52AF3D`).
   - Architecture map & module boundaries (where to add services, translations, UI sections, GAS changes).
   - Non-negotiable technical invariants:
     - `pt-PT` European Portuguese strictly (no PT-BR).
     - GAS `POST` MUST use `text/plain;charset=utf-8` (never `application/json`).
     - Google Sheets formula-injection escaping (`sheetsSafety.ts` + `Code.gs`).
     - Google Drive image normalization (`lh3.googleusercontent.com/d/<ID>=w800`).
     - Opening hours & booking validation tied to `Europe/Lisbon` (Sunday closed, Saturday morning only).
     - Never commit real GAS URLs, API keys, or secrets; always work on feature branches (never commit directly to `main`).
   - Verification commands (`npm test`, `npm run check`, `npm run lint`, `npm run build`).
   - `Lessons Learned / Error Log` section formatted as `[YYYY-MM-DD] Problem: X → Solution: Y`.
2. **`CLAUDE.md` and `GEMINI.md`:** Concise pointers directing agents to read and follow `AGENTS.md` (zero duplicated rules).
3. **`google-apps-script/SETUP.md`:** Step-by-step non-developer setup guide so Pro Motors owners or any helper can connect the Google Sheet + Apps Script + Cloudflare Pages environment variable in under 5 minutes.

---

## 7. Verification Criteria & Testing Strategy

Every change must pass all checks before completion:

| Check | Command / Method | Pass Criteria |
| :--- | :--- | :--- |
| Unit Tests | `npm test` (Vitest) | 100% pass across `schedule.ts`, `validation.ts`, `sheetsSafety.ts`, `driveImage.ts`, `instagramApi.ts`, `bookingApi.ts`, and `pt.ts`/`en.ts` key parity |
| Type Checking | `npm run check` (`astro check`) | 0 TypeScript / Astro errors |
| Linting | `npm run lint` (ESLint) | 0 errors, 0 warnings |
| Static Build | `npm run build` | Clean build; `dist/index.html` (`pt-PT`) and `dist/en/index.html` (`en`) generated with `hreflang` and JSON-LD |
| Visual & Interactive QA | Local preview in browser (`1440×900` & `390×844`) | Zero console errors, crisp dark-mode contrast, `PT ↔ EN` toggle works, service card click pre-selects form chip, Sunday blocked / Saturday morning-only enforced, simulated submission renders `PM-...` confirmation + pre-filled WhatsApp link, error fallback renders WhatsApp recovery button |
| Git Hygiene | `git status` / `git branch` | Work committed on `feat/promotors-website`, zero secrets committed |
