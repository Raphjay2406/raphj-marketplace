export function evaluateFloor(m) {
  const failures = [];
  const fail = (check, detail) => failures.push({ check, detail });

  if (!m.build?.ok) fail('build', m.build?.detail || 'build failed');
  if ((m.console?.errors?.length ?? 0) > 0) fail('console', `${m.console.errors.length} console error(s): ${m.console.errors[0]}`);
  if ((m.overflow?.length ?? 0) > 0) fail('overflow', `horizontal overflow at: ${m.overflow.join(', ')}`);
  if ((m.axe?.critical ?? 0) > 0 || (m.axe?.serious ?? 0) > 0) fail('axe', `${m.axe.critical} critical / ${m.axe.serious} serious a11y violations`);
  if ((m.lighthouse?.performance ?? 0) < (m.perfBudget ?? 0.85)) fail('perf', `Lighthouse perf ${m.lighthouse?.performance} < budget ${m.perfBudget}`);
  if (!m.assets?.ok) fail('assets', m.assets?.detail || 'required asset missing');
  if ((m.interactions?.failed?.length ?? 0) > 0) fail('interactions', `failed interactions: ${m.interactions.failed.join(', ')}`);
  if (!m.motion?.present) fail('motion', 'no motion detected');

  return { pass: failures.length === 0, failures };
}
