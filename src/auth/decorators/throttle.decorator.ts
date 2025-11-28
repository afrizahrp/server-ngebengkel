import { Throttle } from '@nestjs/throttler';

/**
 * Custom throttler decorator untuk rate limit spesifik
 * Menggunakan named throttler dari ThrottlerModule configuration
 */

/**
 * Rate limit untuk auth endpoints yang sangat strict
 * 3 requests per hour
 */
export const ThrottleAuthVeryStrict = () =>
  Throttle({ 'auth-very-strict': { limit: 3, ttl: 3600 } });

/**
 * Rate limit untuk auth endpoints yang strict
 * 5 requests per hour
 */
export const ThrottleAuthStrict = () =>
  Throttle({ 'auth-strict': { limit: 5, ttl: 3600 } });

/**
 * Rate limit untuk auth endpoints (login, register)
 * 10 requests per 15 minutes
 */
export const ThrottleAuth = () => Throttle({ auth: { limit: 10, ttl: 900 } });

/**
 * Rate limit untuk form submission endpoints
 * 10 requests per hour
 */
export const ThrottleFormSubmission = () =>
  Throttle({ 'form-submission': { limit: 10, ttl: 3600 } });

/**
 * Rate limit untuk check availability endpoints
 * 30 requests per minute
 */
export const ThrottleCheckAvailability = () =>
  Throttle({ 'check-availability': { limit: 30, ttl: 60 } });

/**
 * Rate limit untuk GET endpoints (location, system)
 * 5000 requests per minute (ditingkatkan untuk handle listing page dengan banyak request paralel)
 */
export const ThrottleGetEndpoints = () =>
  Throttle({ 'get-endpoints': { limit: 5000, ttl: 60 } });

/**
 * Rate limit untuk batch endpoints (POST untuk batch fetch)
 * 10000 requests per minute (untuk batch endpoints yang sering dipanggil paralel)
 */
export const ThrottleBatchEndpoints = () =>
  Throttle({ 'batch-endpoints': { limit: 10000, ttl: 60 } });

/**
 * Rate limit untuk strict endpoints
 * 10 requests per minute
 */
export const ThrottleStrict = () =>
  Throttle({ strict: { limit: 10, ttl: 60 } });

/**
 * Rate limit untuk working hours endpoints (GET)
 * 5000 requests per minute (ditingkatkan untuk handle listing page dengan banyak request paralel saat reload/sorting)
 */
export const ThrottleWorkingHours = () =>
  Throttle({ 'working-hours': { limit: 5000, ttl: 60 } });