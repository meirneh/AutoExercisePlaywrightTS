// helpers/apiHelpers.ts
import type { APIResponse } from "@playwright/test";

/**
 * Robust parser for APIs that sometimes return HTML with an embedded JSON object.
 * - Tries JSON.parse on full text.
 * - If that fails, extracts the first {...} block and tries again.
 * - Returns null if it cannot parse.
 */
export async function parse(res: APIResponse): Promise<any | null> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/{[\s\S]*}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { /* ignore */ }
    }
    return null;
  }
}

/** Standard header for x-www-form-urlencoded requests */
export const FORM_URLENCODED_HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
} as const;

/** Build x-www-form-urlencoded body from a plain object */
export function toFormUrlEncoded(
  payload: Record<string, string | number | boolean | null | undefined>
): string {
  const cleaned: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) cleaned[k] = String(v);
  }
  return new URLSearchParams(cleaned).toString();
}

