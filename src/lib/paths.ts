/**
 * Prepends the configured Astro BASE_URL to root-relative paths so the site
 * works identically at both "/" (promotors.pt / localhost) and subpath deploys
 * like "/promotors/" (GitHub Pages project URL).
 */
export function withBase(path: string, baseUrl: string = import.meta.env.BASE_URL || '/'): string {
  if (!path) return baseUrl;
  if (/^(?:https?:)?\/\//i.test(path) || path.startsWith('mailto:') || path.startsWith('tel:') || path.startsWith('#')) {
    return path;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const trimmedPath = path.startsWith('/') ? path.slice(1) : path;

  if (!trimmedPath) {
    return normalizedBase;
  }
  return `${normalizedBase}${trimmedPath}`;
}
