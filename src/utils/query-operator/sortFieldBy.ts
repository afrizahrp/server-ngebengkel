/**
 * Generic sort helper with relational field support
 */

export interface SortConfig {
  /**
   * List of allowed fields to sort by
   */
  allowedFields: string[];

  /**
   * Field to order by
   */
  orderBy?: string;

  /**
   * Sort direction
   */
  orderDir?: 'asc' | 'desc';

  /**
   * Custom field mappings for relational fields
   * Key: field name in request
   * Value: Prisma orderBy object
   */
  relationalFields?: Record<string, (dir: 'asc' | 'desc') => any>;

  /**
   * Default fallback field if orderBy is invalid
   */
  defaultField?: string;
}

/**
 * Build safe Prisma orderBy condition
 *
 * @param config - Sort configuration or legacy params
 * @returns Safe orderBy object for Prisma
 */
export function sortFieldBy(
  config: SortConfig | string[],
  orderBy?: string,
  orderDir: 'asc' | 'desc' = 'asc',
): Record<string, any> {
  // Legacy support: sortFieldBy(allowedFields, orderBy, orderDir)
  if (Array.isArray(config)) {
    return buildLegacySort(config, orderBy, orderDir);
  }

  // New format
  const {
    allowedFields,
    orderDir: dir = 'asc',
    relationalFields,
    defaultField,
  } = config;
  const requestedField = config.orderBy || defaultField || allowedFields[0];

  const safeOrderBy = allowedFields.includes(requestedField)
    ? requestedField
    : defaultField || allowedFields[0];

  const safeOrderDir = dir === 'asc' ? 'asc' : 'desc';

  // Check if it's a relational field
  if (relationalFields && relationalFields[safeOrderBy]) {
    return relationalFields[safeOrderBy](safeOrderDir);
  }

  // Handle direct fields
  return {
    [safeOrderBy]: safeOrderDir,
  };
}

/**
 * Legacy function signature for backwards compatibility
 */
function buildLegacySort(
  allowedFields: string[],
  orderBy?: string,
  orderDir: 'asc' | 'desc' = 'asc',
): Record<string, any> {
  const safeOrderBy = allowedFields.includes(orderBy ?? '')
    ? orderBy!
    : allowedFields[0];
  const safeOrderDir = orderDir === 'asc' ? 'asc' : 'desc';

  // Handle relational fields (hardcoded for backwards compat)
  if (safeOrderBy === 'category') {
    return { category: { name: safeOrderDir } };
  }

  // Handle direct fields
  return {
    [safeOrderBy]: safeOrderDir,
  };
}
