import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module.js';

@Module({
  imports: [ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
