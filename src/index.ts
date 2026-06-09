/**
 * @acme/widget-utils — a couple of tiny, pure helpers used by the demo CLI.
 */

/** Convert an arbitrary string into a URL-safe slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Clamp a number to the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError("min must be <= max");
  }
  return Math.min(Math.max(value, min), max);
}
