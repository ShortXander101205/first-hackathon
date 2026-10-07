import { revalidatePath } from 'next/cache';

export type RevalidationHook = (path: string) => void;

let customRevalidateAdvisorHook: RevalidationHook | null = null;

export function setRevalidateAdvisorHook(hook: RevalidationHook | null) {
  customRevalidateAdvisorHook = hook;
}

/**
 * Safely triggers Next.js cache revalidation for the advisor directory.
 * Tolerates Node.js execution environments (where static generation store is not active).
 */
export function safeRevalidateAdvisorCache() {
  if (customRevalidateAdvisorHook) {
    customRevalidateAdvisorHook('/advisor');
    return;
  }

  try {
    revalidatePath('/advisor');
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[PathLess Guide Route] Cache revalidation non-fatal notice:', err);
    }
  }
}
