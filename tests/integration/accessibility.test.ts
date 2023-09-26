import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('landing page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('pixel painter should not have any automatically detectable accessibility issues', async ({page}) => {
    await page.goto('/', {timeout: 1500});
    await page.getByLabel("Toggle Pixel Painter").click()
    await page.getByLabel("Toggle Erase").waitFor();
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  })
});
