import { describe, expect, it } from 'vitest';

import { buildCategoryHref } from './category-filter';

describe('buildCategoryHref', () => {
  it('adds the selected category while preserving other query params', () => {
    expect(buildCategoryHref('/', new URLSearchParams('origem=home'), 'cat-1')).toBe(
      '/?origem=home&categoria=cat-1',
    );
  });

  it('removes only the category when selecting all categories', () => {
    expect(buildCategoryHref('/', new URLSearchParams('categoria=cat-1&origem=home'), null)).toBe(
      '/?origem=home',
    );
  });
});
