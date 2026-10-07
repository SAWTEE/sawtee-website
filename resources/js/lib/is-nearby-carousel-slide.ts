/**
 * Whether a looping carousel should fetch a slide image.
 *
 * HTTP/1.1 can only download a handful of files at once, so offscreen slides
 * wait until they are current or next.
 */
export function isNearbyCarouselSlide(
  index: number,
  current: number,
  length: number
): boolean {
  if (length <= 2) {
    return true;
  }

  if (index === current) {
    return true;
  }

  const next = (current + 1) % length;

  return index === next;
}
