import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  // In-memory store; replace with a repository once the database is wired up.
  // Seeded with fixed ids so the API docs examples work out of the box.
  private readonly products: Product[] = [
    {
      id: '8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b',
      name: 'Wireless Mouse',
      description: 'Ergonomic 2.4GHz wireless mouse with silent clicks',
      price: 24.99,
      stock: 150,
      createdAt: new Date('2026-10-18T08:00:00.000Z'),
      updatedAt: new Date('2026-10-18T08:00:00.000Z'),
    },
    {
      id: '2b7e9d1f-6c4a-4b8e-8d3f-5a9c7e1b2d4f',
      name: 'USB-C Hub',
      description: '7-in-1 hub with HDMI, SD card reader and 100W PD',
      price: 39.5,
      stock: 80,
      createdAt: new Date('2026-10-18T08:05:00.000Z'),
      updatedAt: new Date('2026-10-18T08:05:00.000Z'),
    },
    {
      id: 'c3d4e5f6-a7b8-4c9d-8e0f-1a2b3c4d5e6f',
      name: '27" 4K Monitor',
      description: null,
      price: 329,
      stock: 12,
      createdAt: new Date('2026-10-18T08:10:00.000Z'),
      updatedAt: new Date('2026-10-18T08:10:00.000Z'),
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: string): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const now = new Date();
    const product: Product = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    this.products.push(product);
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const product = this.findOne(id);
    Object.assign(product, dto, { updatedAt: new Date() });
    return product;
  }

  remove(id: string): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    this.products.splice(index, 1);
  }
}
