import { describe, expect, it } from 'vitest';
import { pt } from '../i18n/pt';
import { en } from '../i18n/en';

function collectKeyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return collectKeyPaths(value as Record<string, unknown>, path);
    }
    return [path];
  });
}

function collectStringValues(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((value) => {
    if (typeof value === 'string') return [value];
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return collectStringValues(value as Record<string, unknown>);
    }
    return [];
  });
}

describe('i18n dictionaries (pt-PT & en)', () => {
  it('keeps identical key structure between pt and en', () => {
    const ptKeys = collectKeyPaths(pt as unknown as Record<string, unknown>).sort();
    const enKeys = collectKeyPaths(en as unknown as Record<string, unknown>).sort();
    expect(ptKeys).toEqual(enKeys);
  });

  it('has no empty translation strings', () => {
    for (const value of collectStringValues(pt as unknown as Record<string, unknown>)) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
    for (const value of collectStringValues(en as unknown as Record<string, unknown>)) {
      expect(value.trim().length).toBeGreaterThan(0);
    }
  });

  it('uses clean European Portuguese (no legacy PT-BR phrases or typos)', () => {
    const allPt = collectStringValues(pt as unknown as Record<string, unknown>).join(' ').toLowerCase();
    expect(allPt).not.toContain('trabalhando');
    expect(allPt).not.toContain('mais estamos');
    expect(allPt).not.toContain('celular');
  });
});
