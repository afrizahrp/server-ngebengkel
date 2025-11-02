import { PaginationReminderDto } from '../dto/pagination-reminder.dto';
import { buildSearchCondition } from '../../../utils/query-operator';
import { buildFilterWhereCondition } from '../../../utils/query-operator';

export interface ReminderFilter {
  company_id: string;
  branch_id?: string[];
  entityType?: string[];
  entity_id?: string[];
  reminderType?: string[];
  status?: string[];
  customer_id?: string;
  isRecurring?: boolean;
  scheduledStartDate?: Date;
  scheduledEndDate?: Date;
  createdStartDate?: Date;
  createdEndDate?: Date;
  sentStartDate?: Date;
  sentEndDate?: Date;
}

export function reminderWhereCondition(filter: ReminderFilter): any {
  // Build where condition using generic helper
  return buildFilterWhereCondition({
    filters: {
      company_id: { type: 'equals', value: filter.company_id },
      branch_id: { type: 'in', value: filter.branch_id },
      entityType: { type: 'in', value: filter.entityType },
      entity_id: { type: 'in', value: filter.entity_id },
      reminderType: { type: 'in', value: filter.reminderType },
      status: { type: 'in', value: filter.status },
      customer_id: { type: 'equals', value: filter.customer_id },
      isRecurring: { type: 'boolean', value: filter.isRecurring },
      // Soft delete filter - exclude deleted records
      isDeleted: { type: 'boolean', value: false },
      // Date ranges on different fields
      scheduledDate: {
        type: 'dateRange',
        value: {
          start: filter.scheduledStartDate,
          end: filter.scheduledEndDate,
        },
      },
      createdAt: {
        type: 'dateRange',
        value: {
          start: filter.createdStartDate,
          end: filter.createdEndDate,
        },
      },
      lastSentAt: {
        type: 'dateRange',
        value: {
          start: filter.sentStartDate,
          end: filter.sentEndDate,
        },
      },
    },
  });
}

export function buildReminderSearchCondition(
  filter: PaginationReminderDto,
): any {
  if (!filter.searchBy || !filter.searchTerm) {
    return undefined;
  }

  // Define search field mappings
  const searchFieldMap: Record<string, string[]> = {
    title: ['title'],
    reminderNumber: ['reminderNumber'],
    message: ['message'],
    all: ['title', 'reminderNumber', 'message'],
  };

  // Get fields to search based on searchBy parameter
  const fields = searchFieldMap[filter.searchBy] || ['title', 'reminderNumber'];

  // Use generic search condition builder
  return buildSearchCondition({ fields, searchTerm: filter.searchTerm });
}
