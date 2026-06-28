import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { planCommand } from './plan-command.mjs';
import { graphifyAvailable, graphExists, graphAgeMs } from './capability.mjs';

export function main(argv) {
  const sub = argv[2];
  const args = argv.slice(3);
  const caps = { available: graphifyAvailable(), graphExists: graphExists(), ageMs: graphAgeMs() };
  const plan = planCommand(sub, args, caps);
  if (plan.kind === 'error') { process.stderr.write(plan.message + '\n'); process.exit(2); }
  if (plan.kind === 'info') { process.stdout.write(plan.message + '\n'); return; }
  if (plan.message) process.stdout.write(plan.message + '\n');
  const [cmd, cargs] = plan.exec;
  execFileSync(cmd, cargs, { stdio: 'inherit' });
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv);
