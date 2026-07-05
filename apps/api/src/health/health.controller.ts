import { Controller, Get, HttpCode } from '@nestjs/common';
import { buildHealthStatus, type HealthStatus } from './health.status';

@Controller('healthz')
export class HealthController {
  @Get()
  @HttpCode(200)
  check(): HealthStatus {
    return buildHealthStatus(process.uptime(), new Date());
  }
}
