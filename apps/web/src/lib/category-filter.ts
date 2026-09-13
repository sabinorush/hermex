export const CATEGORY_QUERY_PARAM = 'categoria';

export function buildCategoryHref(
  pathname: string,
  searchParams: Pick<URLSearchParams, 'toString'>,
  categoryId: string | null,
) {
  const params = new URLSearchParams(searchParams.toString());

  if (categoryId) {
    params.set(CATEGORY_QUERY_PARAM, categoryId);
  } else {
    params.delete(CATEGORY_QUERY_PARAM);
  }

  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
