import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import type { Product } from './interfaces/product.interface.js';

@Injectable()
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Product 1', price: 10.99, qty: 100 },
    { id: 2, name: 'Product 2', price: 19.99, qty: 50 },
    { id: 3, name: 'Product 3', price: 5.99, qty: 200 },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(dto: CreateProductDto): Product {
    const nextId = Math.max(0, ...this.products.map((p) => p.id)) + 1;
    const product: Product = {
      id: nextId,
      name: dto.name,
      price: dto.price,
      qty: dto.qty,
    };

    this.products.push(product);
    return product;
  }
}
