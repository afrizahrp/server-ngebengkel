/**
 * Generic pagination helper
 * Calculates safe pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  maxLimit?: number;
}

export interface PaginationResult {
  /**
   * Safe offset for skip in Prisma
   */
  skip: number;

  /**
   * Safe take for take in Prisma
   */
  take: number;

  /**
   * Current page number
   */
  page: number;

  /**
   * Current limit per page
   */
  limit: number;

  /**
   * Total pages based on totalRecords
   */
  totalPages: (totalRecords: number) => number;
}

/**
 * Build safe pagination parameters
 *
 * @param params - Pagination input params
 * @returns Safe pagination values
 */
export function buildPagination(params: PaginationParams): PaginationResult {
  const page = Math.max(1, Number(params.page) || 1);
  const maxLimit = params.maxLimit || 100;
  const limit = Math.min(maxLimit, Math.max(1, Number(params.limit) || 20));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
    totalPages: (totalRecords: number) => Math.ceil(totalRecords / limit),
  };
}
