import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Advisor Portal E2E Workflow', () => {
  test('rejects incorrect passcode, logs in with TEACHER2026, searches students, inspects details, saves note, and logs out', async ({ page }) => {
    // 1. Visit Advisor Portal
    await page.goto('/advisor');

    // 2. Accessibility audit on passcode login view
    const loginAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsLogin = loginAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsLogin).toEqual([]);

    // 3. Attempt invalid passcode
    await page.fill('input#advisor-passcode', 'WRONG_CODE_999');
    await page.click('button:has-text("Open Advisor Directory")');
    await expect(page.locator('text=The passcode entered does not match our school records')).toBeVisible();

    // 4. Authenticate with valid passcode TEACHER2026
    await page.fill('input#advisor-passcode', 'TEACHER2026');
    await page.fill('input#advisor-author-name', 'Kru Somchai');
    await page.click('button:has-text("Open Advisor Directory")');

    // 5. Dashboard loads
    await expect(page.locator('text=School Advisor & Mentor Directory')).toBeVisible();

    // 6. Accessibility audit on Advisor Dashboard
    const dashboardAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsDashboard = dashboardAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsDashboard).toEqual([]);

    // 7. Search & Filter Directory
    const searchInput = page.locator('input#student-search-input');
    await searchInput.fill('Alex');
    await expect(page.locator('tbody tr').first()).toContainText('Alex');

    // 8. Open Student Detail
    const viewButton = page.locator('button:has-text("View Full Guide")').first();
    await expect(viewButton).toBeVisible();
    await viewButton.click();

    // Verify modal drawer opened
    const dialog = page.locator('role=dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('text=Student Profile & Context')).toBeVisible();

    // 9. Accessibility audit on open modal drawer
    const modalAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const criticalViolationsModal = modalAxe.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolationsModal).toEqual([]);

    // 10. Add and save private advisor note
    const noteInput = page.locator('textarea#advisor-note-input');
    await noteInput.fill('Meeting held with student. Recommended exploring Chulalongkorn Software Engineering.');
    await page.click('button:has-text("Save Note")');

    // Verify note saved in notes list
    await expect(page.locator('text=Meeting held with student')).toBeVisible();

    // Close modal drawer
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);

    // 11. Sign Out
    await page.click('button:has-text("Sign Out")');
    await expect(page.locator('input#advisor-passcode')).toBeVisible();
  });
});
