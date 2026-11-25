import type { BookingInput } from './validation';

export type BookingSubmitErrorCode =
  | 'NOT_CONFIGURED'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMITED'
  | 'TOO_FAST'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR';

export interface BookingSubmitResponse {
  ok: boolean;
  bookingId?: string;
  emailSent?: boolean;
  errorCode?: BookingSubmitErrorCode;
}

const REQUEST_TIMEOUT_MS = 12_000;

export async function submitBooking(
  gasWebAppUrl: string,
  payload: BookingInput,
  serviceLabels?: string[],
): Promise<BookingSubmitResponse> {
  const endpoint = gasWebAppUrl.trim();
  if (!endpoint) {
    return { ok: false, errorCode: 'NOT_CONFIGURED' };
  }

  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // CRITICAL: Google Apps Script Web Apps do not handle CORS OPTIONS preflight.
    // Sending text/plain;charset=utf-8 keeps it a CORS simple request while GAS parses JSON via JSON.parse(e.postData.contents).
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        ...payload,
        serviceLabels: serviceLabels ?? payload.services,
        elapsedMs: Math.max(0, Date.now() - payload.startedAt),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { ok: false, errorCode: 'SERVER_ERROR' };
    }

    const data = (await response.json()) as {
      ok?: boolean;
      bookingId?: string;
      emailSent?: boolean;
      error?: string;
    };

    if (data.ok && data.bookingId) {
      return {
        ok: true,
        bookingId: String(data.bookingId),
        emailSent: Boolean(data.emailSent),
      };
    }

    if (data.error === 'RATE_LIMITED') {
      return { ok: false, errorCode: 'RATE_LIMITED' };
    }
    if (data.error === 'TOO_FAST') {
      return { ok: false, errorCode: 'TOO_FAST' };
    }
    if (data.error === 'VALIDATION_ERROR') {
      return { ok: false, errorCode: 'VALIDATION_ERROR' };
    }
    return { ok: false, errorCode: 'SERVER_ERROR' };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, errorCode: 'TIMEOUT' };
    }
    return { ok: false, errorCode: 'NETWORK_ERROR' };
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
