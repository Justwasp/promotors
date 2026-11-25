import { describe, expect, it } from 'vitest';
import { extractGoogleDriveFileId, normalizeImageUrl } from '../lib/driveImage';

describe('Google Drive image URL normalization', () => {
  it('extracts file IDs from common Google Drive sharing formats', () => {
    expect(
      extractGoogleDriveFileId('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view?usp=sharing'),
    ).toBe('1AbCdEfGhIjKlMnOpQrStUvWxYz123456');

    expect(
      extractGoogleDriveFileId('https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456'),
    ).toBe('1AbCdEfGhIjKlMnOpQrStUvWxYz123456');

    expect(
      extractGoogleDriveFileId('https://drive.google.com/uc?export=view&id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456'),
    ).toBe('1AbCdEfGhIjKlMnOpQrStUvWxYz123456');
  });

  it('normalizes Google Drive links to lh3.googleusercontent.com thumbnails', () => {
    expect(
      normalizeImageUrl('https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view'),
    ).toBe('https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456=w800');
  });

  it('passes through valid https URLs and local /images paths', () => {
    expect(normalizeImageUrl('https://cdn.example.com/photo.jpg')).toBe('https://cdn.example.com/photo.jpg');
    expect(normalizeImageUrl('/images/work-brakes.jpg')).toBe('/images/work-brakes.jpg');
  });

  it('rejects unsafe or malformed URLs', () => {
    expect(normalizeImageUrl('javascript:alert(1)')).toBe('');
    expect(normalizeImageUrl('data:text/html,<h1>x</h1>')).toBe('');
    expect(normalizeImageUrl('')).toBe('');
  });
});
