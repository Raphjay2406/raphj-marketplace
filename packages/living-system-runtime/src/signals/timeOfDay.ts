export function currentTimeHM(now = new Date()): string {
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export function subscribeTimeOfDay(cb: (hm: string) => void, interval = 60_000): () => void {
  cb(currentTimeHM());
  const id = setInterval(() => cb(currentTimeHM()), interval);
  return () => clearInterval(id);
}
