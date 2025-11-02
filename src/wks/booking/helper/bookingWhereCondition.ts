import { buildFilterWhereCondition } from '../../../utils/query-operator';

export interface BookingFilter {
  company_id: string;
  branch_id?: string[];
  status?: string[];
  customer_id?: string;
  start_date?: Date | string;
  end_date?: Date | string;
  bay_id?: string[];
  mechanic_id?: string[];
}

export function bookingWhereCondition(filter: BookingFilter): any {
  // Build where condition using generic helper
  const where = buildFilterWhereCondition({
    filters: {
      company_id: { type: 'equals', value: filter.company_id },
      branch_id: { type: 'in', value: filter.branch_id },
      status: { type: 'in', value: filter.status },
      customer_id: { type: 'equals', value: filter.customer_id },
      bay_id: { type: 'in', value: filter.bay_id },
      mechanic_id: { type: 'in', value: filter.mechanic_id },
      // Soft delete filter - exclude deleted records
      isDeleted: { type: 'boolean', value: false },
      // Date range on multiple fields with OR logic
      _dateRange: {
        type: 'dateRange_OR',
        value: {
          fields: ['scheduledStart', 'preferredDate'],
          start: filter.start_date,
          end: filter.end_date,
        },
      },
    },
  });

  return where;
}
