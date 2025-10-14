export function sortFieldBy(
  allowedFields: string[],
  orderBy?: string,
  orderDir: 'asc' | 'desc' = 'asc', // Default ke 'asc' jika tidak diberikan
): Record<string, any> {
  const safeOrderBy = allowedFields.includes(orderBy ?? '')
    ? orderBy!
    : allowedFields[0]; // Fallback ke field pertama (misalnya, 'id')
  const safeOrderDir = orderDir === 'asc' ? 'asc' : 'desc';

  // Handle relational fields
  if (safeOrderBy === 'category') {
    return { category: { name: safeOrderDir } };
  }

  // Handle direct fields
  return {
    [safeOrderBy]: safeOrderDir,
  };
}
