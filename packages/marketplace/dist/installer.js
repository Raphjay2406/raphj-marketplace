import { createHash } from "crypto";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { MarketplaceClient } from "./client.js";
export async function installAgent(inp) {
    const client = new MarketplaceClient({ registry: inp.registry, apiToken: inp.apiToken });
    const manifest = await client.fetchManifest(inp.idWithVersion);
    const res = await fetch(manifest.source_url);
    const buf = Buffer.from(await res.arrayBuffer());
    const actual = "sha256-" + createHash("sha256").update(buf).digest("hex");
    if (actual !== manifest.integrity) {
        throw new Error(`integrity mismatch expected ${manifest.integrity} got ${actual}`);
    }
    mkdirSync(inp.installDir, { recursive: true });
    const pkgPath = join(inp.installDir, manifest.id.replace("/", "__") + ".tar.gz");
    writeFileSync(pkgPath, buf);
    return { path: pkgPath };
}
