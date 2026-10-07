import { describe, expect, it } from 'vitest';

import { isNearbyCarouselSlide } from './is-nearby-carousel-slide';

describe('isNearbyCarouselSlide', () => {
  it('loads every slide when there are two or fewer', () => {
    expect(isNearbyCarouselSlide(0, 0, 1)).toBe(true);
    expect(isNearbyCarouselSlide(0, 0, 2)).toBe(true);
    expect(isNearbyCarouselSlide(1, 0, 2)).toBe(true);
  });

  it('loads only the current slide and the next one in a looping carousel', () => {
    expect(isNearbyCarouselSlide(0, 0, 5)).toBe(true);
    expect(isNearbyCarouselSlide(1, 0, 5)).toBe(true);
    expect(isNearbyCarouselSlide(2, 0, 5)).toBe(false);
    expect(isNearbyCarouselSlide(4, 0, 5)).toBe(false);

    expect(isNearbyCarouselSlide(4, 4, 5)).toBe(true);
    expect(isNearbyCarouselSlide(0, 4, 5)).toBe(true);
    expect(isNearbyCarouselSlide(3, 4, 5)).toBe(false);
  });
});
