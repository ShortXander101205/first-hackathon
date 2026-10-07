/**
 * PathLess Framework v2 - Input Sanitizer & Prompt Injection Guard
 * Zero-dependency sanitization utility for incoming request strings,
 * nested payloads, and AI prompt free-text inputs.
 * 
 * Features:
 * - Recursive stripping of entire <script>, <style>, and <iframe> blocks
 * - Tag bracket stripping, event handler removal, and dangerous protocol cleaning
 * - Call stack recursion depth bounds and prototype pollution protection
 * - Prompt injection delimiter escaping and adversarial instruction neutralization
 */

const SCRIPT_BLOCK_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const STYLE_BLOCK_REGEX = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
const IFRAME_BLOCK_REGEX = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
const HTML_TAG_REGEX = /<[^>]*>/g;
const EVENT_HANDLER_REGEX = /on\w+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi;
const DANGEROUS_PROTOCOLS_REGEX = /(?:javascript|vbscript|data\s*:\s*text\/html)[^\s"']*/gi;
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\u200B-\u200D\uFEFF]/g;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts)/gi,
  /system\s+prompt\s+override/gi,
  /you\s+are\s+now\s+(an?\s+)?unrestricted/gi,
  /forget\s+(all\s+)?(rules|instructions|constraints)/gi,
  /bypass\s+(all\s+)?safety/gi,
  /jailbreak/gi,
  /dan\s+mode/gi,
];

/**
 * Strips HTML tags, script blocks, event handlers, and dangerous protocols from an input string.
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  if (input.length === 0) return '';

  let cleaned = input;

  // 1. Strip entire script, style, and iframe blocks (including inner content)
  cleaned = cleaned.replace(SCRIPT_BLOCK_REGEX, '');
  cleaned = cleaned.replace(STYLE_BLOCK_REGEX, '');
  cleaned = cleaned.replace(IFRAME_BLOCK_REGEX, '');

  // 2. Strip any remaining HTML/XML tags
  cleaned = cleaned.replace(HTML_TAG_REGEX, '');

  // 3. Strip inline DOM event handlers (e.g. onload=, onclick=)
  cleaned = cleaned.replace(EVENT_HANDLER_REGEX, '');

  // 4. Strip dangerous protocols
  cleaned = cleaned.replace(DANGEROUS_PROTOCOLS_REGEX, '');

  // 5. Strip null bytes, control characters, and zero-width spaces
  cleaned = cleaned.replace(CONTROL_CHARS_REGEX, '');

  // 6. Normalize whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Deep-sanitizes all string leaves in an object or array.
 * Protected against call-stack recursion overflow and prototype pollution.
 */
export function sanitizeObject<T>(obj: T, depth = 0, maxDepth = 5): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj) as unknown as T;
  if (typeof obj !== 'object' || depth > maxDepth) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1, maxDepth)) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    // Guard against prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    result[key] = sanitizeObject(value, depth + 1, maxDepth);
  }

  return result as T;
}

/**
 * Sanitizes and neutralizes prompt injection patterns and XML delimiters
 * in free-text fields passed to AI synthesis models.
 */
export function sanitizePromptText(input: unknown, maxLength = 200): string {
  if (typeof input !== 'string') return '';
  if (input.length === 0) return '';

  let cleaned = input;

  // 1. Strip script, style, and iframe blocks first
  cleaned = cleaned.replace(SCRIPT_BLOCK_REGEX, '');
  cleaned = cleaned.replace(STYLE_BLOCK_REGEX, '');
  cleaned = cleaned.replace(IFRAME_BLOCK_REGEX, '');

  // 2. Escape / neutralize XML delimiter tags before generic tag stripping
  cleaned = cleaned
    .replace(/<\s*\/?\s*student_thoughts\s*>/gi, '[student-text]')
    .replace(/<\s*\/?\s*student_anxiety_rationale\s*>/gi, '[student-text]')
    .replace(/<\s*\/?\s*system\s*>/gi, '[system-tag]')
    .replace(/<\s*\/?\s*directive\s*>/gi, '[directive-tag]')
    .replace(/<\s*\/?\s*instruction\s*>/gi, '[instruction-tag]');

  // 3. Strip remaining generic HTML tags
  cleaned = cleaned.replace(HTML_TAG_REGEX, '');

  // 4. Strip inline event handlers and dangerous protocols
  cleaned = cleaned.replace(EVENT_HANDLER_REGEX, '');
  cleaned = cleaned.replace(DANGEROUS_PROTOCOLS_REGEX, '');

  // 5. Strip control characters
  cleaned = cleaned.replace(CONTROL_CHARS_REGEX, '');

  // 6. Neutralize known adversarial directive phrases
  for (const pattern of INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[neutralized directive]');
  }

  // 7. Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 8. Truncate to maximum length
  return cleaned.slice(0, maxLength).trim();
}
