import { SITE_CONFIG } from '../config/site';
import {
  instagramFallback,
  type InstagramShowcaseItem,
} from '../data/instagramFallback';
import { normalizeImageUrl, sanitizeExternalUrl } from './driveImage';

export const INSTAGRAM_CACHE_KEY = 'promotors_instagram_showcase_v1';
const CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8_000;

interface CachedShowcase {
  savedAt: number;
  items: InstagramShowcaseItem[];
}

interface RawGasInstagramItem {
  id?: unknown;
  categoryPt?: unknown;
  categoryEn?: unknown;
  captionPt?: unknown;
  captionEn?: unknown;
  imageUrl?: unknown;
  instagramUrl?: unknown;
}

function normalizeItems(rawItems: unknown): InstagramShowcaseItem[] {
  if (!Array.isArray(rawItems)) return [];

  const normalized: InstagramShowcaseItem[] = [];
  for (let i = 0; i < rawItems.length; i += 1) {
    const raw = rawItems[i] as RawGasInstagramItem | null;
    if (!raw || typeof raw !== 'object') continue;

    const imageUrl = normalizeImageUrl(String(raw.imageUrl ?? ''));
    if (!imageUrl) continue;

    const categoryPt = String(raw.categoryPt ?? '').trim() || 'Oficina';
    const categoryEn = String(raw.categoryEn ?? '').trim() || categoryPt;
    const captionPt = String(raw.captionPt ?? '').trim();
    const captionEn = String(raw.captionEn ?? '').trim() || captionPt;

    normalized.push({
      id: String(raw.id ?? `ig-${i + 1}`),
      categoryPt,
      categoryEn,
      captionPt,
      captionEn,
      imageUrl,
      instagramUrl: sanitizeExternalUrl(
        String(raw.instagramUrl ?? ''),
        SITE_CONFIG.social.instagramUrl,
      ),
    });
  }

  return normalized;
}

export function readCachedInstagramShowcase(): InstagramShowcaseItem[] | null {
  try {
    const raw = globalThis.localStorage?.getItem(INSTAGRAM_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedShowcase;
    if (!Array.isArray(parsed.items) || parsed.items.length === 0) return null;
    if (Date.now() - parsed.savedAt > CACHE_TTL_MS) return null;
    return parsed.items;
  } catch {
    return null;
  }
}

function writeCachedInstagramShowcase(items: InstagramShowcaseItem[]): void {
  try {
    const payload: CachedShowcase = {
      savedAt: Date.now(),
      items,
    };
    globalThis.localStorage?.setItem(INSTAGRAM_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota or private-mode restrictions.
  }
}

export async function fetchInstagramShowcase(
  gasWebAppUrl: string,
): Promise<InstagramShowcaseItem[]> {
  const endpoint = gasWebAppUrl.trim();
  if (!endpoint) {
    return instagramFallback;
  }

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = new URL(endpoint);
    url.searchParams.set('action', 'instagram');

    const response = await fetch(url.toString(), {
      method: 'GET',
      signal: controller.signal,
    });
    if (!response.ok) {
      return readCachedInstagramShowcase() ?? instagramFallback;
    }

    const data = (await response.json()) as { ok?: boolean; items?: unknown };
    const normalized = normalizeItems(data.items);
    if (data.ok && normalized.length > 0) {
      writeCachedInstagramShowcase(normalized);
      return normalized;
    }
  } catch {
    // Fall back silently to cache or bundled items.
  } finally {
    globalThis.clearTimeout(timeoutId);
  }

  return readCachedInstagramShowcase() ?? instagramFallback;
}
