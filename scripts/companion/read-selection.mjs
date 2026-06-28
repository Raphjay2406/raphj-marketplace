import { readFileSync, existsSync } from 'fs';
import { pathToFileURL } from 'node:url';

export function readSelection(eventsPath, { multiselect = false } = {}) {
  if (!existsSync(eventsPath)) return { choices: [], labels: [] };
  let lines;
  try { lines = readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean); }
  catch { return { choices: [], labels: [] }; }

  // server.cjs writes {type:'ws-message', ts, data:{...clientMsg}}; tolerate both shapes.
  const clicks = [];
  for (const line of lines) {
    let obj;
    try { obj = JSON.parse(line); } catch { continue; }
    const c = obj.data && obj.data.choice !== undefined ? obj.data : obj;
    if (c && c.type === 'click' && c.choice !== undefined) clicks.push(c);
  }

  // latest event per choice (clicks are in append order)
  const latest = new Map();
  const labelOf = new Map();
  for (const c of clicks) { latest.set(c.choice, c.selected); labelOf.set(c.choice, c.text || c.choice); }

  if (multiselect) {
    const choices = [...latest.entries()].filter(([, sel]) => sel).map(([ch]) => ch);
    return { choices, labels: choices.map(ch => labelOf.get(ch)) };
  }
  // single-select: the last click overall, if it left something selected
  const last = clicks[clicks.length - 1];
  if (last && latest.get(last.choice)) return { choices: [last.choice], labels: [labelOf.get(last.choice)] };
  return { choices: [], labels: [] };
}

// CLI
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i >= 0 ? process.argv[i + 1] : d; };
  const events = arg('--events');
  if (!events) { console.error('--events <path> required'); process.exit(2); }
  console.log(JSON.stringify(readSelection(events, { multiselect: process.argv.includes('--multiselect') })));
}
