import { useEffect, useState } from "react";
export function useLivingDna(keys) {
    const [values, setValues] = useState({});
    useEffect(() => {
        if (typeof document === "undefined")
            return;
        const read = () => {
            const r = {};
            for (const k of keys)
                r[k] = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
            setValues(r);
        };
        read();
        const id = setInterval(read, 1000);
        return () => clearInterval(id);
    }, [keys.join(",")]);
    return values;
}
