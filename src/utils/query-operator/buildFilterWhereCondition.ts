/**
 * Generic filter configuration for building where conditions
 */
export interface FilterConfig {
  /**
   * Filters to apply
   * Key: field name in schema
   * Value: configuration for that field
   */
  filters: Record<string, FilterFieldConfig>;
}

export interface FilterFieldConfig {
  /**
   * Type of filter operation to apply
   */
  type: 'equals' | 'in' | 'dateRange' | 'dateRange_OR' | 'boolean';

  /**
   * Value from the DTO to apply
   * Can be any type depending on the field
   */
  value: any;
}

/**
 * Build where condition from generic filter config
 * Supports:
 * - equals: single value match
 * - in: array value match
 * - dateRange: start/end date filter on single field
 * - dateRange_OR: date range on multiple fields with OR logic
 * - boolean: true/false filter
 */
export function buildFilterWhereCondition<T = any>(
  filter: FilterConfig,
): Partial<T> {
  const where: any = {};
  const orConditions: any[] = [];

  for (const [fieldName, config] of Object.entries(filter.filters)) {
    if (config.value === undefined || config.value === null) {
      continue;
    }

    switch (config.type) {
      case 'equals':
        where[fieldName] = config.value;
        break;

      case 'in':
        // Only apply if array has values
        if (Array.isArray(config.value) && config.value.length > 0) {
          where[fieldName] = { in: config.value };
        }
        break;

      case 'boolean':
        if (typeof config.value === 'boolean') {
          where[fieldName] = config.value;
        }
        break;

      case 'dateRange':
        // dateRange expects { start?: Date, end?: Date }
        if (typeof config.value === 'object' && config.value !== null) {
          const { start, end } = config.value;
          if (start || end) {
            where[fieldName] = {};
            if (start) {
              where[fieldName].gte =
                start instanceof Date ? start : new Date(start);
            }
            if (end) {
              where[fieldName].lte = end instanceof Date ? end : new Date(end);
            }
          }
        }
        break;

      case 'dateRange_OR':
        // dateRange_OR expects { fields: string[], start?: Date | string, end?: Date | string }
        // This creates OR conditions between multiple date fields
        if (typeof config.value === 'object' && config.value !== null) {
          const { fields, start, end } = config.value;
          if (Array.isArray(fields) && fields.length > 0 && (start || end)) {
            // Normalize dates
            const normStart = start
              ? start instanceof Date
                ? start
                : new Date(start)
              : undefined;
            const normEnd = end
              ? end instanceof Date
                ? end
                : new Date(end)
              : undefined;

            // Create conditions for each field
            for (const field of fields) {
              const condition: any = {};
              if (normStart && normEnd) {
                condition[field] = { gte: normStart, lte: normEnd };
              } else if (normStart) {
                condition[field] = { gte: normStart };
              } else if (normEnd) {
                condition[field] = { lte: normEnd };
              }
              if (Object.keys(condition).length > 0) {
                orConditions.push(condition);
              }
            }
          }
        }
        break;
    }
  }

  // Merge OR conditions if any
  if (orConditions.length > 0) {
    if (where.OR && Array.isArray(where.OR)) {
      where.OR = [...where.OR, ...orConditions];
    } else {
      where.OR = orConditions;
    }
  }

  return where;
}
