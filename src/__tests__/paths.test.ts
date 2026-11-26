import { describe, expect, it } from 'vitest';
import { withBase } from '../lib/paths';

describe('withBase path helper', () => {
  it('keeps root-relative paths clean when base is "/"', () => {
    expect(withBase('/', '/')).toBe('/');
    expect(withBase('/en/', '/')).toBe('/en/');
    expect(withBase('/images/hero-motorcycle.jpg', '/')).toBe('/images/hero-motorcycle.jpg');
  });

  it('prefixes subpath base cleanly for GitHub Pages project URLs', () => {
    expect(withBase('/', '/promotors')).toBe('/promotors/');
    expect(withBase('/', '/promotors/')).toBe('/promotors/');
    expect(withBase('/en/', '/promotors')).toBe('/promotors/en/');
    expect(withBase('/images/hero-motorcycle.jpg', '/promotors')).toBe(
      '/promotors/images/hero-motorcycle.jpg',
    );
  });

  it('leaves external URLs, mailto, tel, and hash links untouched', () => {
    expect(withBase('https://promotorsparts.com/', '/promotors')).toBe('https://promotorsparts.com/');
    expect(withBase('tel:+351212314830', '/promotors')).toBe('tel:+351212314830');
    expect(withBase('#marcacao', '/promotors')).toBe('#marcacao');
  });
});
