/**
 * Generic search condition builder
 * Supports single field or multiple fields search with OR logic
 */

export interface SearchConfig {
  /**
   * Field(s) to search in
   * If string: search in single field
   * If array: search in multiple fields with OR logic
   */
  fields: string | string[];

  /**
   * Search term
   */
  searchTerm?: string;
}

/**
 * Build Prisma search condition
 *
 * For single field: returns AND conditions for each word
 * For multiple fields: returns OR conditions between fields with AND within each field
 *
 * @param config - Search configuration
 * @returns Array of search conditions or undefined
 */
export function buildSearchCondition(
  config?: SearchConfig | { searchBy?: string; searchTerm?: string },
): Array<Record<string, any>> | undefined {
  // Legacy support: { searchBy, searchTerm } format
  if (config && 'searchBy' in config) {
    return buildLegacySearchCondition(config.searchBy, config.searchTerm);
  }

  // New format: { fields, searchTerm }
  if (!config || !('fields' in config) || !config.fields || !config.searchTerm?.trim()) {
    return undefined;
  }

  const fields = Array.isArray(config.fields) ? config.fields : [config.fields];
  const words = config.searchTerm.trim().split(/\s+/);

  if (fields.length === 0 || words.length === 0) {
    return undefined;
  }

  // Multiple fields: create OR conditions between fields
  if (fields.length > 1) {
    const conditions: any[] = [];
    for (const field of fields) {
      for (const word of words) {
        conditions.push({
          [field]: {
            contains: word,
            mode: 'insensitive',
          },
        });
      }
    }
    return conditions;
  }

  // Single field: create AND conditions for each word
  return words.map((word) => ({
    [fields[0]]: {
      contains: word,
      mode: 'insensitive',
    },
  }));
}

/**
 * Legacy function signature for backwards compatibility
 */
function buildLegacySearchCondition(
  searchBy?: string,
  searchTerm?: string,
): Array<Record<string, any>> | undefined {
  if (!searchBy || !searchTerm?.trim()) return;

  const words = searchTerm.trim().split(/\s+/);
  return words.map((word) => ({
    [searchBy]: {
      contains: word,
      mode: 'insensitive',
    },
  }));
}
