const KEY = "genorah:ls:visits";

export function readVisitCount(): number {
  try { return Number(localStorage.getItem(KEY)) || 0; } catch { return 0; }
}

export function incrementVisit(): number {
  const next = readVisitCount() + 1;
  // Silent failure is intentional: Safari private mode + storage quota rejection
  // should not break visit tracking. The signal just won't persist across tabs/sessions.
  try { localStorage.setItem(KEY, String(next)); } catch {}
  return next;
}

export function subscribeVisitCount(cb: (n: number) => void): () => void {
  cb(readVisitCount());
  return () => {};
}
