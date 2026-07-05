export interface HealthStatus {
  status: 'ok';
  service: string;
  uptimeSeconds: number;
  timestamp: string;
}

/**
 * Builds the liveness payload served by GET /healthz.
 *
 * Deliberately free of any framework imports so it can be unit-tested without
 * bootstrapping Nest, and reused by any future readiness/health probe.
 */
export function buildHealthStatus(
  uptimeSeconds: number,
  now: Date,
): HealthStatus {
  return {
    status: 'ok',
    service: 'ridenow-api',
    uptimeSeconds: Math.floor(uptimeSeconds),
    timestamp: now.toISOString(),
  };
}
