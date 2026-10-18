import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({
    format: 'uuid',
    example: '8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b',
  })
  id: string;

  @ApiProperty({ example: 'Wireless Mouse' })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Ergonomic 2.4GHz wireless mouse with silent clicks',
  })
  description: string | null;

  @ApiProperty({ example: 24.99, description: 'Price in USD' })
  price: number;

  @ApiProperty({ example: 150, description: 'Units in stock' })
  stock: number;

  @ApiProperty({ example: '2026-10-18T08:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-18T08:00:00.000Z' })
  updatedAt: Date;
}
