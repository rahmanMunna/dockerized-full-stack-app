import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller.js";
import { ProductService } from "./product.service.js";

@Module({
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule {}