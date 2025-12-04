import { PrismaService } from '../prisma.service';

/**
 * Generate a unique slug from a name
 * Converts name to lowercase, replaces spaces and special characters with hyphens
 * Removes consecutive hyphens and trims leading/trailing hyphens
 *
 * @param name The name to convert to slug
 * @returns The generated slug (e.g., "Bengkel Utama" -> "bengkel-utama")
 */
export function generateSlug(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '') // Remove special characters (keep only word chars, spaces, hyphens)
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug for waiting list
 * If slug already exists, appends a number suffix
 *
 * @param name The name to convert to slug
 * @param prisma Prisma service instance
 * @returns A unique slug that doesn't exist in the database
 */
export async function generateUniqueSlug(
  name: string,
  prisma: PrismaService,
): Promise<string> {
  const baseSlug = generateSlug(name);

  if (!baseSlug) {
    throw new Error('Cannot generate slug from empty name');
  }

  // Check if slug exists
  const existing = await prisma.wks_waitingList.findFirst({
    where: {
      slug: baseSlug,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!existing) {
    return baseSlug;
  }

  // If slug exists, find the next available number suffix
  for (let i = 2; i <= 999; i++) {
    const newSlug = `${baseSlug}-${i}`;
    const exists = await prisma.wks_waitingList.findFirst({
      where: {
        slug: newSlug,
        isDeleted: false,
      },
      select: { id: true },
    });

    if (!exists) {
      return newSlug;
    }
  }

  // Fallback: shouldn't reach here in normal circumstances
  throw new Error(`Cannot generate unique slug for name: ${name}`);
}
