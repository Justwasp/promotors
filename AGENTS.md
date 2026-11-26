# AGENTS.md — Pro Motors (`promotors.pt`) AI-Agent & Developer Guide

This file is the **single source of truth** for AI coding agents and developers working on the **Pro Motors (`promotors.pt`)** website repository. Read this before making changes.

---

## 1. Project Overview

- **Business:** **Pro Motors** — multi-brand motorcycle & scooter mechanics workshop in Montijo, Portugal (`R. Joaquim de Almeida, 90A, 2870-342 Montijo`, next to PSP).
- **Live Domain:** `https://promotors.pt/` (bilingual static site: `/` in European Portuguese `pt-PT`, `/en/` in English `en`).
- **Related Store:** `https://promotorsparts.com/` (linked in navbar, services banner, and footer — do not break or remove).
- **Budget Constraint:** **€0/month** ongoing cost.
  - Static frontend (`dist/`) deployed to Cloudflare Pages / GitHub Pages (or any static host).
  - Backend runs as a container-bound **Google Apps Script Web App** (`google-apps-script/Code.gs`) inside Pro Motors' own Google Account (Google Sheets CRM + Gmail notifications + curated Instagram showcase CMS via Google Drive).

---

## 2. Visual Design System ("Precision Garage")

Visual ground-truth mockups live in `docs/superpowers/specs/assets/` (`design-hero-services.jpg`, `design-instagram-booking.jpg`), and the full spec is at `docs/superpowers/specs/2026-11-25-promotors-site-design.md`.

### Core Tokens (`src/styles/global.css`)
- **Asphalt Black (canvas):** `#0B0D0E` (`bg-asphalt`)
- **Carbon Surface (cards/panels):** `#14181A` (`bg-carbon`)
- **Carbon Elevated:** `#1C2124` (`bg-carbon-elevated`)
- **Pro Motors Green (primary accent):** `#52AF3D` (`text-pro-green` / `bg-pro-green`), hover `#63C74D`
- **Primary / Secondary Text:** `#F5F7F6` / `#9BA6A1`
- **Typography:**
  - Display uppercase headlines: `Barlow Condensed` (`font-display`)
  - Body & UI controls: `Plus Jakarta Sans` (`font-sans`)
  - Eyebrows, booking IDs (`PM-YYYY-XXXX`), hours: `JetBrains Mono` (`font-mono`)

Maintain WCAG AA+ contrast on all surfaces — never place white text over un-scrimmed photography.

---

## 3. Repository Architecture & Module Boundaries

```text
├── google-apps-script/
│   ├── Code.gs                 # Container-bound GAS Web App (Pedidos CRM, Gmail, Instagram JSON)
│   └── SETUP.md                # 5-minute owner setup guide
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/                 # Optimized hero + fallback workshop photos
└── src/
    ├── config/site.ts          # Single source of truth for contacts, hours, links, PUBLIC_GAS_WEB_APP_URL
    ├── data/
    │   ├── services.ts         # Canonical 6 service IDs (must match i18n keys)
    │   └── instagramFallback.ts# Local fallback showcase items when GAS is unset/offline
    ├── i18n/
    │   ├── types.ts            # Strongly-typed TranslationDictionary interface
    │   ├── pt.ts               # European Portuguese (pt-PT) ONLY
    │   ├── en.ts               # English (en)
    │   └── utils.ts            # getTranslations(), getAlternateLocalePath()
    ├── lib/                    # Pure, unit-tested TypeScript modules (keep DOM-free where possible)
    │   ├── calendar.ts         # Monday-first calendar grid builder (disables past dates & Sundays) + localized formatting
    │   ├── schedule.ts         # Europe/Lisbon open status, Sunday/Saturday slot rules, WhatsApp URL builder
    │   ├── validation.ts       # BookingInput validation & length caps
    │   ├── sheetsSafety.ts     # Google Sheets formula-injection neutralization
    │   ├── driveImage.ts       # Google Drive share URL → lh3.googleusercontent.com/d/<ID>=w800
    │   ├── bookingApi.ts       # POST to GAS (text/plain CORS-safe, 12s timeout)
    │   └── instagramApi.ts     # GET ?action=instagram + localStorage 15m SWR cache + fallback
    ├── components/             # Isolated Astro components (Header, Hero, Services, InstagramShowcase, BookingForm, Footer, PrivacyModal, MobileActionBar)
    ├── layouts/BaseLayout.astro# HTML shell, Google Fonts, canonical/hreflang, MotorcycleRepair JSON-LD
    ├── pages/
    │   ├── index.astro         # Default pt-PT route (/)
    │   └── en/index.astro      # English route (/en/)
    └── __tests__/              # Vitest unit test suites
```

### Where to Make Common Changes
- **Change phone/WhatsApp/email/address/links:** edit `src/config/site.ts` (and mirror `WORKSHOP_*` constants in `google-apps-script/Code.gs` if workshop contact info in emails changes).
- **Add or edit a service:** update `src/data/services.ts`, add matching copy in both `src/i18n/pt.ts` and `src/i18n/en.ts` (enforced by `src/__tests__/i18n.test.ts` and TypeScript), and add an icon case in `src/components/Services.astro`.
- **Update copy / translations:** edit `src/i18n/pt.ts` and `src/i18n/en.ts`. Keep strict key parity.
- **Update Google Sheets CRM / Gmail / Instagram GAS backend:** edit `google-apps-script/Code.gs`. Remember that owners must publish a **New version** under *Deploy → Manage deployments* in Apps Script after updating `Code.gs`.

---

## 4. Non-Negotiable Technical Invariants

Do **not** violate these rules when editing code:

1. **European Portuguese (`pt-PT`) Only:** `src/i18n/pt.ts` must use idiomatic `pt-PT` (*Marcação, Telemóvel, Morada, Revisão, Estamos a trabalhar*). Never introduce `pt-BR` (*trabalhando, celular, você*). `src/__tests__/i18n.test.ts` guards against regressions.
2. **GAS CORS Rule (`text/plain`):** `src/lib/bookingApi.ts` MUST send `POST` requests with `Content-Type: text/plain;charset=utf-8` and a JSON string body. Changing this to `application/json` triggers a browser `OPTIONS` preflight, which Google Apps Script Web Apps do **not** support and will break bookings in production.
3. **Google Sheets Formula-Injection Protection:** Both `src/lib/sheetsSafety.ts` and `escapeCell_()` in `google-apps-script/Code.gs` must prefix values starting with `=`, `+`, `-`, `@`, `\t`, or `\r` with `'`. Portuguese phone numbers start with `+351` and would otherwise be treated as formulas by Sheets.
4. **Google Drive Image Normalization:** `src/lib/driveImage.ts` and `normalizeDriveImageUrl_()` in `Code.gs` convert Google Drive share links (`file/d/<ID>`, `open?id=`, `uc?id=`) to `https://lh3.googleusercontent.com/d/<ID>=w800` and reject non-HTTPS / unsafe schemes (`javascript:`, `data:`).
5. **Workshop Schedule (`Europe/Lisbon`):** Opening hours are Mon–Fri `09:00–19:00`, Saturday `09:00–13:00`, Sunday closed. Booking validation MUST reject past dates, reject Sundays, and allow only `morning` slots on Saturdays — enforced both client-side (`src/lib/schedule.ts`, `src/lib/validation.ts`) and server-side (`Code.gs`).
6. **Gmail Quota Resilience:** Free Gmail allows 100 emails/day. `Code.gs` MUST always save the booking row to `Pedidos` before attempting `MailApp.sendEmail`, and never fail a booking if daily email quota is exhausted.
7. **Zero Lead Loss (WhatsApp Recovery):** If `PUBLIC_GAS_WEB_APP_URL` is empty or GAS times out/errors, `BookingForm.astro` must display a pre-filled WhatsApp CTA (`wa.me/351968505075?text=...`) with the customer's entered form values.
8. **Modern Web Platform Rules:**
   - `PrivacyModal.astro` uses native `<dialog closedby="any">` opened with `showModal()`, without redundant `role="dialog"` / `aria-modal`, with `dialog:modal` + `dialog::backdrop` `overscroll-behavior: contain` (no `body { overflow: hidden }`), and keeps the Safari pointerdown/pointerup fallback.
   - `BookingForm.astro` uses `:user-invalid`/`:user-valid` post-interaction validation and syncs `aria-invalid` / `aria-describedby` dynamically (never pre-linking hidden errors in markup).
   - Hero LCP image (`Hero.astro`) keeps `fetchpriority="high"` without `loading="lazy"`; below-the-fold Instagram images (`InstagramShowcase.astro`) keep `loading="lazy"` without `fetchpriority="low"`.

---

## 5. Verification Commands (Mandatory Before Every Commit / Completion)

Run all four checks after code changes:

```bash
npm test        # Vitest unit tests (schedule, validation, sheetsSafety, driveImage, i18n, APIs)
npm run check   # Astro + TypeScript strict type checking
npm run lint    # ESLint (TS + Astro rules)
npm run build   # Production static build (dist/index.html, dist/en/index.html, sitemap-index.xml)
```

For UI/layout changes, also verify `npm run preview` on desktop (`1440×900`) and mobile (`390×844`) with zero console errors.

---

## 6. Git & Security Policy

- **Never commit directly to `main` or `master`.** Always use a feature branch (e.g., `feat/...`, `fix/...`) and open a pull request.
- **Never commit secrets, API keys, `.env` files, or production Apps Script Web App URLs.** Only commit `.env.example` with empty placeholder values.

---

## 7. Lessons Learned / Error Log

Record resolved issues here using `[YYYY-MM-DD] Problem: X → Solution: Y`:

- `[2026-11-25] Problem: Google Apps Script Web Apps reject CORS OPTIONS preflight triggered by application/json POST requests → Solution: Always POST JSON stringified payloads with Content-Type: text/plain;charset=utf-8 and parse via JSON.parse(e.postData.contents).`
- `[2026-11-25] Problem: Google Drive uc?export=view image URLs can be throttled or fail to render inline in browsers → Solution: Normalize Drive file IDs to https://lh3.googleusercontent.com/d/<ID>=w800 with local fallback images on error.`
- `[2026-11-26] Problem: Automated booking confirmation emails from MailApp.sendEmail landed in Spam when sent as HTML-only dark-themed markup without a plain-text body or with a cross-domain replyTo → Solution: Always include plain-text body (multipart/alternative), sender name ("Pro Motors Montijo"), clean light transactional HTML without heavy promo buttons, and only set replyTo on client emails when sender and workshop email share the same domain.`
