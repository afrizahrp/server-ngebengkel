import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Custom ThrottlerGuard yang menghitung rate limit secara global
 * untuk semua endpoint dengan preset yang sama, bukan per endpoint.
 * 
 * Masalah dengan default ThrottlerGuard:
 * - Rate limit dihitung per endpoint (IP + route path + method)
 * - Setiap endpoint dengan preset yang sama punya limit terpisah
 * - Saat reload page dengan banyak request ke endpoint yang sama, limit cepat habis
 * 
 * Solusi:
 * - Override generateKey untuk menghitung rate limit secara global per preset
 * - Semua endpoint dengan preset yang sama berbagi limit yang sama per IP
 * - Format key: `throttler:${presetName}:${ip}` (tanpa route path)
 */
@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  /**
   * Override generateKey untuk menghitung rate limit secara global
   * berdasarkan preset name saja, bukan per endpoint.
   * 
   * Signature: generateKey(context: ExecutionContext, suffix: string, name: string): string
   * 
   * - context: Execution context
   * - suffix: Biasanya tracker (IP address)
   * - name: Preset name (misalnya 'working-hours', 'get-endpoints')
   * 
   * Format key: `throttler:${name}:${suffix}`
   * 
   * Ini memastikan semua endpoint dengan preset yang sama
   * berbagi limit yang sama per IP, bukan per endpoint.
   */
  protected generateKey(
    context: ExecutionContext,
    suffix: string,
    name: string,
  ): string {
    // Gunakan preset name dan IP saja, tanpa route path
    // Ini membuat rate limit global per preset per IP
    return `throttler:${name}:${suffix}`;
  }

  /**
   * Override getTracker untuk mendapatkan IP address dengan benar
   * Mendukung X-Forwarded-For untuk proxy/load balancer
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Cek X-Forwarded-For header (untuk proxy/load balancer)
    const forwardedFor = req.headers?.['x-forwarded-for'];
    if (forwardedFor) {
      // X-Forwarded-For bisa berisi multiple IPs, ambil yang pertama
      const ips = forwardedFor.split(',').map((ip: string) => ip.trim());
      return ips[0];
    }
    
    // Fallback ke IP langsung
    return req.ip || req.connection?.remoteAddress || 'unknown';
  }
}

