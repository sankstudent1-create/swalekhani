// ─────────────────────────────────────────────
//  lib/letterpad/imageConvert.ts — make any uploaded image
//  PDF-safe. @react-pdf/renderer <Image> renders PNG/JPEG only:
//  an uploaded SVG, WebP or GIF logo used to vanish silently from
//  the downloaded PDF even though the on-screen paper showed it.
//  Converting at upload time (and again at PDF time, as a safety
//  net for images already in state) means the PDF always gets a
//  PNG it can actually draw. PNG/JPEG pass through untouched.
// ─────────────────────────────────────────────

export function isPdfSafeImage(src: string | null | undefined): boolean {
  if (!src) return false;
  return /^data:image\/(png|jpeg|jpg)/i.test(src);
}

/** Convert any data-URI / blob image to a PNG data URI via canvas.
    Returns the original value when it is already PNG/JPEG, null
    when there is nothing to convert, or the original value when
    conversion fails (so the caller still shows something on the
    paper — the PDF's usableImage gate will skip it there, as
    before, rather than breaking generation). Browser-only. */
export async function toPngDataUrl(src: string | null | undefined): Promise<string | null> {
  if (!src) return null;
  if (isPdfSafeImage(src)) return src;
  if (typeof document === 'undefined') return src;
  try {
    const img = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('image load failed'));
    });
    img.src = src;
    await loaded;
    const w = Math.min(img.naturalWidth || 512, 1024) || 512;
    const h = Math.min(img.naturalHeight || 512, 1024) || 512;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return src;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  } catch {
    return src;
  }
}
