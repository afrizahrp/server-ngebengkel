/**
 * Priority Calculation Utilities
 * 
 * Shared priority calculation logic for backend services.
 * Matches frontend implementation for consistency.
 */

export const PRIORITY_THRESHOLDS = {
  TERTINGGI: 80,  // Priority "1" - Highest priority (score ≥ 80)
  TINGGI: 65,     // Priority "2" - High priority (score ≥ 65)
  SEDANG: 50,   // Priority "3" - Medium priority (score ≥ 50)
  RENDAH: 0, // Priority "4" - Lowest priority (score < 50)
} as const;

export type PriorityLevel = '1' | '2' | '3' | '4';

/**
 * Calculate priority label based on Google Business Profile rating and review count.
 *
 * Priority Formula:
 *   score = (rating × 20) - (log₁₀(reviewCount + 1) × 15)
 *
 * @param rating Google Business Profile rating (0.0 - 5.0)
 * @param reviewCount Total number of reviews (0 - N)
 * @returns priority label: "1", "2", "3", or "4"
 */
export function getPriorityLabel(
  rating: number,
  reviewCount: number,
): PriorityLevel {
  const score = calculatePriorityScore(rating, reviewCount);

  if (score >= PRIORITY_THRESHOLDS.TERTINGGI) return '1';
  if (score >= PRIORITY_THRESHOLDS.TINGGI) return '2';
  if (score >= PRIORITY_THRESHOLDS.SEDANG) return '3';
  if (score >= PRIORITY_THRESHOLDS.RENDAH) return '4';
  return '4';
}

/**
 * Calculate numeric priority score.
 *
 * Formula: score = (rating × 20) - (log₁₀(reviewCount + 1) × 15)
 *
 * @param rating Google Business Profile rating (0.0 - 5.0)
 * @param reviewCount Total number of reviews (0 - N)
 * @returns Calculated priority score
 */
export function calculatePriorityScore(
  rating: number,
  reviewCount: number,
): number {
  if (rating < 0) rating = 0;
  if (reviewCount < 0) reviewCount = 0;

  const ratingScore = rating * 20;
  const reviewPenalty = Math.log10(reviewCount + 1) * 15;

  return ratingScore - reviewPenalty;
}
