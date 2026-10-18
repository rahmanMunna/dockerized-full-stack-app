import { DeepPartial } from "typeorm";
import { Product } from "./entities/product.entity.js";

export const PRODUCTS_SEED: DeepPartial<Product>[] = [
{
    id: '8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b',
    name: 'Wireless Mouse',
    description: 'Ergonomic 2.4GHz wireless mouse with silent clicks',
    price: 24.99,
    stock: 150,
  },
]