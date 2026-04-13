export async function subscribeBattery(cb) {
    const nav = navigator;
    if (!nav?.getBattery) {
        cb(1);
        return () => { };
    }
    const bat = await nav.getBattery();
    const emit = () => cb(bat.level);
    emit();
    bat.addEventListener("levelchange", emit);
    return () => bat.removeEventListener("levelchange", emit);
}
