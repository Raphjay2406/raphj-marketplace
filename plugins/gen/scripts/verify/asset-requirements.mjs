const WOW_BEATS = new Set(['HOOK', 'PEAK']);
const TEXTURE_BEATS = new Set(['TENSION', 'CLOSE']);

export function requiredPayload(beat) {
  const b = String(beat || '').toUpperCase();
  if (WOW_BEATS.has(b)) return 'wow';
  if (TEXTURE_BEATS.has(b)) return 'texture';
  return null;
}

const PLACEHOLDER = /(placeholder|\bTODO\b|^data:|^\s*$)/i;
const SIGNATURE = /<canvas|data-r3f|data-signature|<video|data-shader/i;

function manifestPaths(manifest) {
  return new Set((manifest || []).map(a => a.path).filter(Boolean));
}

function realImageSrcs(html) {
  const srcs = [];
  const re = /<img[^>]+src=["']([^"']+)["']/gi;
  let mch;
  while ((mch = re.exec(html))) srcs.push(mch[1]);
  return srcs.filter(s => !PLACEHOLDER.test(s));
}

export function checkAssetPresence({ beat, html = '', manifest = [] }) {
  const need = requiredPayload(beat);
  if (!need) return { ok: true, detail: 'no asset requirement for beat' };

  const paths = manifestPaths(manifest);
  const backedImage = realImageSrcs(html).some(s => paths.has(s));

  if (need === 'wow') {
    if (backedImage) return { ok: true, detail: 'generated image present' };
    if (SIGNATURE.test(html)) return { ok: true, detail: 'signature mount present' };
    return { ok: false, detail: `${beat} requires a generated image or signature moment; none found` };
  }
  // texture
  if (backedImage || SIGNATURE.test(html)) return { ok: true, detail: 'texture/atmosphere asset present' };
  return { ok: false, detail: `${beat} requires a texture/atmosphere asset or signature interaction; none found` };
}
