import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module.js';
import { ProductModule } from './modules/product/product.module.js';

@Module({
  imports: [HealthModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
