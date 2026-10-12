import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductService } from './product.service.js';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts() {
    return this.productService.getProducts();
  }

  @Post()
  addProduct(@Body() dto: CreateProductDto) {
    const product = this.productService.addProduct(dto);
    return { message: 'product has been added', product };
  }
}
