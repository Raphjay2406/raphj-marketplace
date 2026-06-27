// scripts/verify/lighthouse.mjs
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';

export async function runLighthouse(url) {
  let chrome;
  try {
    chrome = await launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
    const runnerResult = await lighthouse(url, {
      port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'silent',
    });
    const score = runnerResult?.lhr?.categories?.performance?.score;
    if (typeof score !== 'number') return { performance: 0, error: 'no performance score' };
    return { performance: score };
  } catch (e) {
    return { performance: 0, error: e?.message ?? String(e) };
  } finally {
    if (chrome) await chrome.kill();
  }
}
