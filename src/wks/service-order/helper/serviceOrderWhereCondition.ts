import { buildFilterWhereCondition } from '../../../utils/query-operator';

export interface ServiceOrderFilter {
  company_id: string;
  branch_id?: string[];
  orderStatus?: string[];
  customer_id?: string;
  mechanic_id?: string;
  serviceBay_id?: string;
  start_date?: Date | string;
  end_date?: Date | string;
}

export function serviceOrderWhereCondition(filter: ServiceOrderFilter): any {
  // Build where condition using generic helper
  return buildFilterWhereCondition({
    filters: {
      company_id: { type: 'equals', value: filter.company_id },
      branch_id: { type: 'in', value: filter.branch_id },
      orderStatus: { type: 'in', value: filter.orderStatus },
      customer_id: { type: 'equals', value: filter.customer_id },
      mechanic_id: { type: 'equals', value: filter.mechanic_id },
      serviceBay_id: { type: 'equals', value: filter.serviceBay_id },
      // Soft delete filter - exclude deleted records
      isDeleted: { type: 'boolean', value: false },
      // Date range on orderDate
      orderDate: {
        type: 'dateRange',
        value: {
          start: filter.start_date,
          end: filter.end_date,
        },
      },
    },
  });
}
