const FORMULA_TRIGGER_PATTERN = /^[=+\-@\t\r]/;

/**
 * Neutralizes spreadsheet formula injection (CSV/Google Sheets) by prefixing
 * values starting with =, +, -, @, tab, or carriage return with a single quote.
 * Especially important for Portuguese phone numbers starting with "+351".
 */
export function escapeForGoogleSheets(value: string): string {
  if (!value) return '';
  const cleaned = value.replace(/[\t\r]+/g, ' ').trim();
  if (!cleaned) return '';
  return FORMULA_TRIGGER_PATTERN.test(cleaned) || FORMULA_TRIGGER_PATTERN.test(value)
    ? `'${cleaned}`
    : cleaned;
}
