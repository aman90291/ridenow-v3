import { Test, type TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { buildHealthStatus } from './health.status';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = moduleRef.get(HealthController);
  });

  it('GET /healthz reports an ok status', () => {
    const result = controller.check();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('ridenow-api');
    expect(typeof result.uptimeSeconds).toBe('number');
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(() => new Date(result.timestamp).toISOString()).not.toThrow();
  });

  it('buildHealthStatus is a pure function of its inputs', () => {
    const now = new Date('2026-07-05T00:00:00.000Z');

    expect(buildHealthStatus(12.9, now)).toEqual({
      status: 'ok',
      service: 'ridenow-api',
      uptimeSeconds: 12,
      timestamp: '2026-07-05T00:00:00.000Z',
    });
  });
});
