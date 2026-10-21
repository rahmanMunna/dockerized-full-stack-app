import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';
import { PRODUCTS_SEED } from './products.seed.js';
import { CacheService } from '../../redis/cache.service.js';
import { ConfigService } from '@nestjs/config';
import { PRODUCT_CACHE_KEYS } from './products.cache-keys.js';

@Injectable()
export class ProductsService implements OnApplicationBootstrap {
  
  private readonly cacheTtl: number;

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly cache: CacheService,
    config: ConfigService
  ) {
    this.cacheTtl = Number(config.get<string>('CACHE_TTL_SECONDS') ?? 60);
  }

  //seeding data to the database if the products table is empty
  async onApplicationBootstrap(){
    if((await this.productsRepository.count()) === 0) {
      await this.productsRepository.save(PRODUCTS_SEED);
    }
  }

  async findAll(): Promise<Product[]> {
    const cached = await this.cache.get<Product[]>(PRODUCT_CACHE_KEYS.list);
    if (cached) return cached;

    const products = await this.productsRepository.find({ order: { createdAt: 'ASC' } });
    await this.cache.set(PRODUCT_CACHE_KEYS.list, products, this.cacheTtl);

    return products;
  }

  async findOne(id: string): Promise<Product> {
    const key = PRODUCT_CACHE_KEYS.one(id);
    const cached = await this.cache.get<Product>(key);
    if (cached) return cached;

    const product = await this.findOneFromDb(id);
    await this.cache.set(key, product, this.cacheTtl);
    return product;
  
  }

  private async findOneFromDb(id: string): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      ...dto,
      description: dto.description ?? null,
      stock: dto.stock ?? 0,
    });
    const saved = await this.productsRepository.save(product);
    await this.cache.del(PRODUCT_CACHE_KEYS.list);
    return saved;
  }

   async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOneFromDb(id);
    this.productsRepository.merge(product, dto);
    const saved = await this.productsRepository.save(product);
    await this.cache.del(PRODUCT_CACHE_KEYS.list, PRODUCT_CACHE_KEYS.one(id));
    return saved;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    await this.cache.del(PRODUCT_CACHE_KEYS.list, PRODUCT_CACHE_KEYS.one(id));
  }
}
