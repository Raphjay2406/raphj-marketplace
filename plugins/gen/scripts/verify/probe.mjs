// scripts/verify/probe.mjs
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

export async function probe(url, { breakpoints = [375, 768, 1280, 1440] } = {}) {
  const browser = await chromium.launch();
  const result = { console: { errors: [] }, overflow: [], axe: { critical: 0, serious: 0 }, motion: { present: false }, html: '', screenshots: {} };
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('console', m => { if (m.type() === 'error') result.console.errors.push(m.text()); });
    page.on('pageerror', e => result.console.errors.push(String(e)));

    for (const w of breakpoints) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(url, { waitUntil: 'networkidle' });
      const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (over) result.overflow.push(`${w}px`);
      result.screenshots[`${w}`] = await page.screenshot({ fullPage: true });
    }

    // measure motion + html + axe at desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(url, { waitUntil: 'networkidle' });
    result.html = await page.content();
    result.motion.present = await page.evaluate(() => {
      if (document.querySelector('[data-motion],[data-framer-motion],[style*="animation"]')) return true;
      return [...document.querySelectorAll('*')].some(el => {
        const s = getComputedStyle(el);
        return (s.transitionDuration && s.transitionDuration !== '0s') ||
               (s.animationName && s.animationName !== 'none');
      });
    });
    const axe = await new AxeBuilder({ page }).analyze();
    for (const v of axe.violations) {
      if (v.impact === 'critical') result.axe.critical += 1;
      else if (v.impact === 'serious') result.axe.serious += 1;
    }
  } finally {
    await browser.close();
  }
  return result;
}
