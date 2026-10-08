import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Student Intake to Results E2E Journey', () => {
  test('completes Step 0 through 12, views 4 cards, expands milestones, checks universities and print styles', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Navigate to home
    await page.goto('/');
    await expect(page).toHaveTitle(/PathLess/i);

    // 2. Automated Axe Audit on Welcome / Step 0
    const step0AxeResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsStep0 = step0AxeResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsStep0).toEqual([]);

    // 3. Step 0: Fill profile
    await page.fill('input#student-full-name', 'Alex Morgan');
    await page.selectOption('select#student-grade-level', 'grade_12');
    await page.fill('input#student-id', 'STU-99012');
    await page.click('button:has-text("Begin PathLess Guide")');

    // 4. Complete Steps 1 through 10
    // Step 1: Task Interests (Multi-select)
    await page.waitForSelector('text=When you lose track of time');
    await page.locator('button[role="checkbox"]').filter({ hasText: 'Building & Fixing Things' }).click();
    await page.waitForTimeout(300);

    // Audit accessibility on active question step
    const step1Axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsStep1 = step1Axe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsStep1).toEqual([]);

    await page.click('button:has-text("Continue")');

    // Step 2: Academic Curiosity (Single-select)
    await page.waitForSelector('text=Which subject area makes you most curious');
    await page.locator('button[role="radio"]').filter({ hasText: 'Technology & Computing' }).click();
    await page.click('button:has-text("Continue")');

    // Step 3: High School Study Track (Single-select)
    await page.waitForSelector('text=Which study track or academic stream are you pursuing');
    const trackRadio = page.locator('button[role="radio"]').first();
    await trackRadio.waitFor({ state: 'visible' });
    await trackRadio.click();
    await page.click('button:has-text("Continue")');

    // Step 4: Academic Hesitation (Free-text thoughts)
    await page.waitForSelector('text=What feels most challenging or stressful');
    await page.fill('textarea#academic-hesitation-input', 'I worry about very difficult advanced math prerequisites.');
    await page.click('button:has-text("Continue")');

    // Steps 5 through 11: General profile choices
    for (let step = 5; step <= 11; step++) {
      const radio = page.locator('button[role="radio"]').first();
      await radio.waitFor({ state: 'visible' });
      await radio.click();
      await page.click('button:has-text("Continue")');
    }

    // Step 12: Ambition timeline + Finish CTA
    const step12Radio = page.locator('button[role="radio"]').first();
    await step12Radio.waitFor({ state: 'visible' });
    await step12Radio.click();
    await page.click('button:has-text("Finish & Explore Pathways")');

    // 5. Results Screen Verification
    await page.waitForSelector('article[data-testid^="career-card-"]', { timeout: 30000 });
    await expect(page.getByRole('heading', { name: "Alex's Recommended Pathways" })).toBeVisible();
    const cards = page.locator('article[data-testid^="career-card-"]');
    await expect(cards).toHaveCount(4);

    // Verify qualitative badges and absence of percentage scores / startup jargon
    await expect(page.locator('text=Top Match').first()).toBeVisible();
    await expect(page.locator('text=% Natural Fit')).toHaveCount(0);
    await expect(page.locator('text=Moonshot Trajectory')).toHaveCount(0);

    // 6. Milestone Inspection: Expand the first card
    const firstCardToggle = cards.first().locator('button[aria-controls^="pathway-details-"]');
    await expect(firstCardToggle).toHaveAttribute('aria-expanded', 'false');
    await firstCardToggle.click();
    await expect(firstCardToggle).toHaveAttribute('aria-expanded', 'true');

    // Check 3-stage progression line
    await expect(cards.first().locator('text=1. College Major')).toBeVisible();
    await expect(cards.first().locator('text=2. First Job')).toBeVisible();
    await expect(cards.first().locator('text=3. Growth Role')).toBeVisible();

    // 7. University Link Verification
    const uniLinks = cards.first().locator('a[target="_blank"]');
    const uniLinkCount = await uniLinks.count();
    if (uniLinkCount > 0) {
      const firstUniLink = uniLinks.first();
      await expect(firstUniLink).toHaveAttribute('rel', 'noopener noreferrer');
    }

    // 8. Print Stylesheet Media Emulation Verification
    await page.emulateMedia({ media: 'print' });
    const printHeader = page.locator('header:has-text("PathLess Educational Guidance")');
    await expect(printHeader).toBeVisible();
    await page.emulateMedia({ media: 'screen' });
    await expect(printHeader).toBeHidden();

    // 9. Automated Axe Audit on Active Results Screen
    const resultsAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsResults = resultsAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsResults).toEqual([]);
  });
});
