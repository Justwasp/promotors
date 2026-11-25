import { describe, expect, it } from 'vitest';
import { escapeForGoogleSheets } from '../lib/sheetsSafety';

describe('escapeForGoogleSheets', () => {
  it('prefixes strings starting with dangerous formula triggers', () => {
    expect(escapeForGoogleSheets('+351 968 505 075')).toBe("'+351 968 505 075");
    expect(escapeForGoogleSheets('=IMPORTXML("http://evil")')).toBe('\'=IMPORTXML("http://evil")');
    expect(escapeForGoogleSheets('-1+1')).toBe("'-1+1");
    expect(escapeForGoogleSheets('@SUM(A1:A2)')).toBe("'@SUM(A1:A2)");
    expect(escapeForGoogleSheets('\t=1+1')).toBe("'=1+1");
  });

  it('preserves ordinary text without altering it', () => {
    expect(escapeForGoogleSheets('Honda PCX 125')).toBe('Honda PCX 125');
    expect(escapeForGoogleSheets('João Silva')).toBe('João Silva');
    expect(escapeForGoogleSheets('')).toBe('');
  });
});
