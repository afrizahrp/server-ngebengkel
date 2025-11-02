# Query Operator Helpers

Helper global yang reusable untuk operasi query database yang umum digunakan di berbagai service.

## Overview

Helper ini dirancang untuk mengeliminasi duplikasi kode (DRY) pada operasi query yang sama seperti:

- Pagination
- Sorting
- Searching
- Filtering dengan berbagai kondisi

## Lokasi

Semua helper berada di: `src/utils/query-operator/`

## Prisma Dependency

Helper global ini **tidak memiliki dependency** terhadap `@prisma/client` sehingga dapat digunakan di project apapun (TypeORM, Sequelize, MongoDB, dll).

Hanya layer helper per-service (mis. `bookingWhereCondition.ts`) yang menggunakan Prisma types untuk type safety.

## Helper yang Tersedia

### 1. `buildPagination`

Membantu menghitung parameter pagination yang aman.

```typescript
import { buildPagination } from '../../utils/query-operator';

const pagination = buildPagination({ page, limit, maxLimit: 100 });

// Menggunakan
const [data, totalRecords] = await Promise.all([
  prisma.table.findMany({
    skip: pagination.skip,
    take: pagination.take,
  }),
  prisma.table.count({ where }),
]);

const totalPages = pagination.totalPages(totalRecords);
```

**Parameter:**

- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 20)
- `maxLimit`: Maksimum limit yang diizinkan (default: 100)

**Return:**

- `skip`: Safe offset untuk Prisma
- `take`: Safe limit untuk Prisma
- `page`: Current page
- `limit`: Current limit
- `totalPages(totalRecords)`: Function untuk menghitung total pages

### 2. `sortFieldBy`

Membantu membangun kondisi orderBy yang aman dengan whitelist field.

```typescript
import { sortFieldBy } from '../../utils/query-operator';

// Legacy format (backward compatible)
const orderBy = sortFieldBy(
  ['name', 'email', 'createdAt'],
  orderByParam,
  orderDirParam,
);

// New format (lebih fleksibel)
const orderBy = sortFieldBy({
  allowedFields: ['name', 'email', 'createdAt'],
  orderBy: orderByParam,
  orderDir: orderDirParam,
  // Optional: untuk relational fields
  relationalFields: {
    category: (dir) => ({ category: { name: dir } }),
  },
  defaultField: 'createdAt',
});

await prisma.table.findMany({
  orderBy,
});
```

**Mode Legacy:**

- Parameter pertama: array allowed fields
- Parameter kedua: field yang diminta user
- Parameter ketiga: direction ('asc' | 'desc')

**Mode Baru:**

- `allowedFields`: Array field yang diizinkan
- `orderBy`: Field yang diminta
- `orderDir`: Direction ('asc' | 'desc')
- `relationalFields`: Mapping untuk nested fields
- `defaultField`: Fallback field jika invalid

### 3. `buildSearchCondition`

Membantu membangun kondisi pencarian dengan dukungan multi-field.

```typescript
import { buildSearchCondition } from '../../utils/query-operator';

// Legacy format
const searchConditions = buildSearchCondition(searchBy, searchTerm);

// New format (recommended)
const searchConditions = buildSearchCondition({
  fields: 'orderNumber', // Single field
  searchTerm: 'ABC123',
});

// Multi-field search dengan OR logic
const searchConditions = buildSearchCondition({
  fields: ['orderNumber', 'customer.name', 'vehicle.licensePlate'],
  searchTerm: 'ABC123',
});

// Merge ke where condition
const where: any = { company_id };
const searchConditions = buildSearchCondition({ fields, searchTerm });

if (searchConditions) {
  where.AND = searchConditions;
}
```

**Mode Legacy:**

- Parameter pertama: field name
- Parameter kedua: search term

**Mode Baru:**

- `fields`: String (single field) atau Array (multiple fields)
- `searchTerm`: Text yang dicari

**Behavior:**

- Single field: AND conditions untuk setiap word
- Multiple fields: OR conditions antar fields dengan AND dalam field
- Case-insensitive search

### 4. `buildFilterWhereCondition`

Membantu membangun where conditions dengan berbagai jenis filter.

```typescript
import { buildFilterWhereCondition } from '../../utils/query-operator';
import { Prisma } from '@prisma/client';

const where = buildFilterWhereCondition<Prisma.SomeTableWhereInput>({
  filters: {
    company_id: { type: 'equals', value: companyId },
    status: { type: 'in', value: ['ACTIVE', 'PENDING'] },
    isActive: { type: 'boolean', value: true },
    createdAt: {
      type: 'dateRange',
      value: { start: new Date('2024-01-01'), end: new Date('2024-12-31') },
    },
    // OR condition pada multiple date fields
    _dateRange: {
      type: 'dateRange_OR',
      value: {
        fields: ['startDate', 'endDate'],
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
      },
    },
  },
});

await prisma.table.findMany({ where });
```

**Filter Types:**

1. **`equals`**: Single value match

   ```typescript
   { type: 'equals', value: 'ABC123' }
   ```

2. **`in`**: Array value match

   ```typescript
   { type: 'in', value: ['ACTIVE', 'PENDING', 'DONE'] }
   ```

   - Hanya diterapkan jika array memiliki value

3. **`boolean`**: Boolean filter

   ```typescript
   { type: 'boolean', value: true }
   ```

4. **`dateRange`**: Date range pada single field

   ```typescript
   {
     type: 'dateRange',
     value: {
       start?: Date,
       end?: Date
     }
   }
   ```

5. **`dateRange_OR`**: Date range pada multiple fields dengan OR logic
   ```typescript
   {
     type: 'dateRange_OR',
     value: {
       fields: ['field1', 'field2'],
       start?: Date,
       end?: Date
     }
   }
   ```
   - Membuat OR condition antara fields
   - Berguna untuk mencari di field startDate ATAU endDate

## Contoh Penggunaan Lengkap

### Booking Service

```typescript
// helper/bookingWhereCondition.ts
export function bookingWhereCondition(filter: BookingFilter) {
  return buildFilterWhereCondition<Prisma.wks_ServiceBookingWhereInput>({
    filters: {
      company_id: { type: 'equals', value: filter.company_id },
      branch_id: { type: 'in', value: filter.branch_id },
      status: { type: 'in', value: filter.status },
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
}

// booking.service.ts
async findAll(paginationDto: PaginationBookingDto) {
  const { page, limit, searchBy, searchTerm, orderBy, orderDir } = paginationDto;

  // Build pagination
  const pagination = buildPagination({ page, limit, maxLimit: 100 });

  // Build sort
  const orderByCondition = sortFieldBy(
    ['bookingNumber', 'bookingDate', 'status'],
    orderBy,
    orderDir,
  );

  // Build where
  const whereCondition = bookingWhereCondition(filter);
  const searchConditions = buildSearchCondition({ searchBy, searchTerm });

  if (searchConditions) {
    whereCondition.AND = searchConditions;
  }

  // Execute
  const [totalRecords, bookings] = await Promise.all([
    prisma.wks_ServiceBooking.count({ where: whereCondition }),
    prisma.wks_ServiceBooking.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      skip: pagination.skip,
      take: pagination.take,
    }),
  ]);

  return {
    data: bookings,
    totalRecords,
  };
}
```

### Reminder Service

```typescript
// helper/reminderWhereCondition.ts
export function reminderWhereCondition(filter: ReminderFilter) {
  return buildFilterWhereCondition<Prisma.sys_ReminderWhereInput>({
    filters: {
      company_id: { type: 'equals', value: filter.company_id },
      branch_id: { type: 'in', value: filter.branch_id },
      entityType: { type: 'in', value: filter.entityType },
      status: { type: 'in', value: filter.status },
      isRecurring: { type: 'boolean', value: filter.isRecurring },
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
    },
  });
}

export function buildReminderSearchCondition(dto: PaginationReminderDto) {
  const searchFieldMap: Record<string, string[]> = {
    title: ['title'],
    reminderNumber: ['reminderNumber'],
    message: ['message'],
    all: ['title', 'reminderNumber', 'message'],
  };

  const fields = searchFieldMap[dto.searchBy] || ['title', 'reminderNumber'];
  return buildSearchCondition({ fields, searchTerm: dto.searchTerm });
}
```

## Migration Guide

### Migrating from Manual Implementation

**Before:**

```typescript
async findAll(dto) {
  const page = Number(dto.page) || 1;
  const limit = Math.min(100, Number(dto.limit) || 20);
  const skip = (page - 1) * limit;

  const allowedFields = ['name', 'email'];
  const orderBy = allowedFields.includes(dto.orderBy)
    ? dto.orderBy
    : 'name';
  const orderDirection = dto.orderDir === 'asc' ? 'asc' : 'desc';

  const where: any = { company_id: dto.company_id };

  if (dto.status && dto.status.length > 0) {
    where.status = { in: dto.status };
  }

  if (dto.start_date && dto.end_date) {
    where.createdAt = {
      gte: new Date(dto.start_date),
      lte: new Date(dto.end_date),
    };
  }

  // ... more logic
}
```

**After:**

```typescript
async findAll(dto: PaginationDto) {
  // Build pagination
  const pagination = buildPagination({ page: dto.page, limit: dto.limit });

  // Build sort
  const orderBy = sortFieldBy(
    ['name', 'email'],
    dto.orderBy,
    dto.orderDir,
  );

  // Build where
  const where = buildFilterWhereCondition({
    filters: {
      company_id: { type: 'equals', value: dto.company_id },
      status: { type: 'in', value: dto.status },
      createdAt: {
        type: 'dateRange',
        value: { start: dto.start_date, end: dto.end_date },
      },
    },
  });

  const searchConditions = buildSearchCondition({
    fields: 'name',
    searchTerm: dto.searchTerm,
  });

  if (searchConditions) {
    where.AND = searchConditions;
  }

  const [totalRecords, data] = await Promise.all([
    prisma.table.count({ where }),
    prisma.table.findMany({
      where,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
    }),
  ]);

  return { data, totalRecords };
}
```

## Services yang Sudah Menggunakan Helper

✅ **Booking Service** - `src/wks/booking/`

- `bookingWhereCondition.ts` - menggunakan `buildFilterWhereCondition`
- `booking.service.ts` - menggunakan semua helper

✅ **Reminder Service** - `src/wks/reminder/`

- `reminderWhereCondition.ts` - menggunakan `buildFilterWhereCondition` & `buildSearchCondition`
- `reminder.service.ts` - menggunakan `buildPagination` & `sortFieldBy`

✅ **Service Order Service** - `src/wks/service-order/`

- `serviceOrderWhereCondition.ts` - menggunakan `buildFilterWhereCondition`
- `service-order.service.ts` - menggunakan semua helper (method `findAllPaginated`)

## Benefits

1. **DRY (Don't Repeat Yourself)**: Logic yang sama tidak perlu diulang
2. **Consistency**: Semua service menggunakan pattern yang sama
3. **Maintainability**: Perubahan logic hanya di satu tempat
4. **Type Safety**: Full TypeScript support dengan Prisma types
5. **Backward Compatible**: Legacy format masih didukung
6. **Flexible**: Dukungan untuk use case kompleks (relational, OR conditions, dll)
7. **Safe**: Built-in validation dan sanitization

## Next Steps

Untuk service baru atau service yang perlu refactor, gunakan helper ini daripada membuat implementasi manual.

Jika ada use case khusus yang belum didukung, extend helper ini dengan type filter baru.
