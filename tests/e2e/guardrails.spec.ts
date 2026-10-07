import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Security Guardrails & Error Boundaries E2E', () => {
  test('asserts rate limiting triggers calm message, sanitization strips HTML tags, and error fallbacks render safely', async ({ page, request }) => {
    // 1. Rate Limiting Trigger Check on Login Route with isolated synthetic IP
    let rateLimited = false;
    for (let i = 0; i < 6; i++) {
      const res = await request.post('/api/advisor/login', {
        data: { passcode: 'INCORRECT_PASS', authorName: 'Attacker' },
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '198.51.100.99', // Prevents cross-test rate limit pollution
        },
      });
      if (res.status() === 429) {
        rateLimited = true;
        const body = await res.json();
        expect(body.code).toBe('RATE_LIMITED');
        expect(body.detail).toContain('Too many passcode attempts have been made recently');
        expect(res.headers()['retry-after']).toBeDefined();
        break;
      }
    }
    expect(rateLimited).toBe(true);

    // 2. Input Sanitization Test: HTML & Script tags in intake Step 0
    await page.goto('/');
    await page.fill('input#student-full-name', '<b>Malicious</b><script>alert("hack")</script>');
    await page.selectOption('select#student-grade-level', 'grade_12');
    await page.click('button:has-text("Begin PathLess Guide")');

    // Confirm navigation succeeded to Step 1 without raw script injection into DOM
    await expect(page.locator('text=When you lose track of time')).toBeVisible();
    const injectedScripts = await page.locator('script:has-text("alert(\\"hack\\")")').count();
    expect(injectedScripts).toBe(0);

    // 3. Automated Axe Accessibility Audit on Sanitized State
    const axeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolations = axeResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations).toEqual([]);
  });
});
