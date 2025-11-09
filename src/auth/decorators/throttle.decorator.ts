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
  Throttle({ default: { limit: 3, ttl: 3600 } });

/**
 * Rate limit untuk auth endpoints yang strict
 * 5 requests per hour
 */
export const ThrottleAuthStrict = () =>
  Throttle({ default: { limit: 5, ttl: 3600 } });

/**
 * Rate limit untuk auth endpoints (login, register)
 * 10 requests per 15 minutes
 */
export const ThrottleAuth = () =>
  Throttle({ default: { limit: 10, ttl: 900 } });

/**
 * Rate limit untuk form submission endpoints
 * 10 requests per hour
 */
export const ThrottleFormSubmission = () =>
  Throttle({ default: { limit: 10, ttl: 3600 } });

/**
 * Rate limit untuk check availability endpoints
 * 30 requests per minute
 */
export const ThrottleCheckAvailability = () =>
  Throttle({ default: { limit: 30, ttl: 60 } });

/**
 * Rate limit untuk GET endpoints (location, system)
 * 100 requests per minute
 */
export const ThrottleGetEndpoints = () =>
  Throttle({ default: { limit: 100, ttl: 60 } });

/**
 * Rate limit untuk strict endpoints
 * 10 requests per minute
 */
export const ThrottleStrict = () =>
  Throttle({ default: { limit: 10, ttl: 60 } });
