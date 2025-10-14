import { BadRequestException } from '@nestjs/common';
import { ProductFilter } from './productFilter';

export function productWhereCondition(
  filter: ProductFilter,
  options: {
    requiredFilters?: Partial<Record<keyof ProductFilter, boolean>>;
    additionalConditions?: Record<string, any>;
  } = {},
): Record<string, any> {
  const { company_id, category, iShowedStatus } = filter;
  const { requiredFilters = {}, additionalConditions = {} } = options;

  const whereCondition: Record<string, any> = {
    ...additionalConditions,
  };

  // Filter by company_id
  if (
    requiredFilters.company_id &&
    (!company_id || (Array.isArray(company_id) && company_id.length === 0))
  ) {
    throw new BadRequestException('At least one valid company_id is required');
  }
  if (company_id) {
    const normalizedCompanyIds = Array.isArray(company_id)
      ? company_id.filter((id) => typeof id === 'string' && id !== '')
      : [company_id].filter((id) => typeof id === 'string' && id !== '');
    if (normalizedCompanyIds.length > 0) {
      whereCondition.company_id = {
        in: normalizedCompanyIds,
        mode: 'insensitive',
      };
    }
  }

  // Filter by category name - menggunakan relasi category yang benar
  if (category && category.length > 0) {
    const normalizedCategories = Array.isArray(category)
      ? category.filter((name) => typeof name === 'string' && name !== '')
      : [category].filter((name) => typeof name === 'string' && name !== '');
    if (normalizedCategories.length > 0) {
      whereCondition.category = {
        name: {
          in: normalizedCategories,
          mode: 'insensitive',
        },
      };
    }
  }

  // Filter by iShowedStatus
  if (iShowedStatus) {
    whereCondition.iShowedStatus = {
      in: Array.isArray(iShowedStatus) ? iShowedStatus : [iShowedStatus],
    };
  }

  console.log('productWhereCondition result:', whereCondition); // Debugging
  return whereCondition;
}
