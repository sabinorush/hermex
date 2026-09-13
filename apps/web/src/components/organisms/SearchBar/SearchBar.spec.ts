import { describe, expect, it } from 'vitest';

import { DATE_ERROR_MESSAGE, getSearchDateError } from './SearchBar';

describe('getSearchDateError', () => {
  it('accepts a return date after the pickup date', () => {
    expect(getSearchDateError('2026-10-10', '2026-10-12')).toBeNull();
  });

  it('rejects a return date before or equal to the pickup date', () => {
    expect(getSearchDateError('2026-10-10', '2026-10-09')).toBe(DATE_ERROR_MESSAGE);
    expect(getSearchDateError('2026-10-10', '2026-10-10')).toBe(DATE_ERROR_MESSAGE);
  });

  it('lets native required validation handle missing dates', () => {
    expect(getSearchDateError('', '2026-10-12')).toBeNull();
    expect(getSearchDateError('2026-10-10', '')).toBeNull();
  });
});
