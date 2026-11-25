const DRIVE_FILE_ID_PATTERNS = [
  /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{10,})/,
  /drive\.google\.com\/(?:open|uc)\?[^#]*[?&]?id=([a-zA-Z0-9_-]{10,})/,
  /lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/,
];

export function extractGoogleDriveFileId(rawUrl: string): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  for (const pattern of DRIVE_FILE_ID_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * Normalizes Google Drive sharing links to reliable lh3.googleusercontent.com thumbnails,
 * allows safe HTTPS URLs and local /images/... assets, and rejects unsafe schemes.
 */
export function normalizeImageUrl(rawUrl: string, width = 800): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    return `https://lh3.googleusercontent.com/d/${driveId}=w${width}`;
  }

  if (trimmed.startsWith('/images/') && !trimmed.includes('..')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    return '';
  }

  return '';
}

export function sanitizeExternalUrl(rawUrl: string, fallbackUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallbackUrl;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return fallbackUrl;
  }

  return fallbackUrl;
}
