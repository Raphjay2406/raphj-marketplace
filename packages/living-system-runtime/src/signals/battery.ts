export async function subscribeBattery(cb: (level_0_1: number) => void): Promise<() => void> {
  const nav = navigator as any;
  if (!nav?.getBattery) { cb(1); return () => {}; }
  const bat = await nav.getBattery();
  const emit = () => cb(bat.level);
  emit();
  bat.addEventListener("levelchange", emit);
  return () => bat.removeEventListener("levelchange", emit);
}
