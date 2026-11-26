import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitBooking } from '../lib/bookingApi';
import { fetchInstagramShowcase, INSTAGRAM_CACHE_KEY } from '../lib/instagramApi';
import { instagramFallback } from '../data/instagramFallback';

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

describe('bookingApi (Google Apps Script POST contract)', () => {
  it('returns NOT_CONFIGURED cleanly when GAS URL is empty', async () => {
    const res = await submitBooking('', {
      services: ['revisao'],
      bike: 'Yamaha MT-07',
      preferredDate: '2026-11-26',
      timeSlot: 'morning',
      name: 'Maria Costa',
      phone: '+351 961 234 567',
      email: 'maria@example.pt',
      notes: '',
      gdprAccepted: true,
      lang: 'pt',
      website: '',
      startedAt: Date.now() - 4000,
    });

    expect(res.ok).toBe(false);
    expect(res.errorCode).toBe('NOT_CONFIGURED');
  });

  it('sends POST with text/plain;charset=utf-8 to avoid GAS CORS preflight', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, bookingId: 'PM-2026-0042', emailSent: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await submitBooking('https://script.google.com/macros/s/TEST/exec', {
      services: ['oleo'],
      bike: 'Honda PCX 125',
      preferredDate: '2026-11-26',
      timeSlot: 'morning',
      name: 'João Silva',
      phone: '+351 912 345 678',
      email: 'joao@example.pt',
      notes: 'Troca de óleo',
      gdprAccepted: true,
      lang: 'pt',
      website: '',
      startedAt: Date.now() - 5000,
    });

    expect(res).toEqual({ ok: true, bookingId: 'PM-2026-0042', emailSent: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('text/plain;charset=utf-8');
  });
});

describe('instagramApi (Google Sheets showcase + SWR cache)', () => {
  it('returns bundled fallback without fetching when GAS URL is empty', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const items = await fetchInstagramShowcase('');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(items).toEqual(instagramFallback);
  });

  it('normalizes Drive image URLs from GAS response and writes to localStorage cache', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        items: [
          {
            id: '1',
            categoryPt: 'Travões',
            categoryEn: 'Brakes',
            captionPt: 'Pastilhas novas',
            captionEn: 'New brake pads',
            imageUrl: 'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view',
            instagramUrl: 'https://www.instagram.com/promotorspt/',
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const items = await fetchInstagramShowcase('https://script.google.com/macros/s/TEST/exec');
    expect(items).toHaveLength(1);
    expect(items[0]?.imageUrl).toBe('https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456=w800');
    expect(localStorage.getItem(INSTAGRAM_CACHE_KEY)).toBeTruthy();
  });
});
