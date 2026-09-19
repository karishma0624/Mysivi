/**
 * Input Sanitization and Defense Utilities
 * Neutralizes prompt injections, strips malicious markup, and caps string sizes.
 */

export function sanitizeString(input: unknown, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';

  return input
    // Strip null bytes and non-printable control characters (except newline/tab)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Strip basic script injection attempts
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Normalize excessive whitespace
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function escapePromptDelimiters(input: string): string {
  // Prevent escaping out of <<<DATA>>> delimiters
  return input.replace(/<<<\/?DATA>>>/gi, '');
}
