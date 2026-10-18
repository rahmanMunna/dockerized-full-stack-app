import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type ValueTransformer,
} from 'typeorm';

// Postgres returns NUMERIC columns as strings to avoid precision loss.
const numericToNumber: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity('products')
export class Product {
  @ApiProperty({ format: 'uuid', example: '8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ type: String, nullable: true, example: 'Ergonomic 2.4GHz wireless mouse with silent clicks' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ example: 24.99, description: 'Price in USD' })
  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: numericToNumber })
  price: number;

  @ApiProperty({ example: 150, description: 'Units in stock' })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({ example: '2026-10-18T08:00:00.000Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-18T08:00:00.000Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
