import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';
import { ProductsService } from './products.service.js';

const SAMPLE_PRODUCT_ID = '8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b';

const ProductIdParam = () =>
  ApiParam({
    name: 'id',
    format: 'uuid',
    description: 'Product id. The example is a seeded product.',
    example: SAMPLE_PRODUCT_ID,
  });

const NotFound = () =>
  ApiNotFoundResponse({
    description: 'No product with this id',
    type: ErrorResponseDto,
    example: {
      statusCode: 404,
      message: `Product with id "${SAMPLE_PRODUCT_ID}" not found`,
      error: 'Not Found',
    },
  });

const InvalidId = () =>
  ApiBadRequestResponse({
    description: 'The id is not a valid UUID, or the body failed validation',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: 'Validation failed (uuid is expected)',
      error: 'Bad Request',
    },
  });

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List products',
    description: 'Returns every product.',
  })
  @ApiOkResponse({ description: 'List of products', type: [Product] })
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product' })
  @ProductIdParam()
  @ApiOkResponse({ description: 'The product', type: Product })
  @InvalidId()
  @NotFound()
  findOne(@Param('id', ParseUUIDPipe) id: string): Product {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a product',
    description:
      '`name` and `price` are required. `stock` defaults to 0. ' +
      'Unknown fields are rejected.',
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      full: {
        summary: 'All fields',
        value: {
          name: 'Mechanical Keyboard',
          description: 'RGB backlit keyboard with hot-swappable switches',
          price: 89.99,
          stock: 40,
        },
      },
      minimal: {
        summary: 'Required fields only',
        value: { name: 'HDMI Cable', price: 9.99 },
      },
      invalid: {
        summary: 'Invalid (returns 400)',
        value: { name: '', price: -5, color: 'red' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'The created product', type: Product })
  @ApiBadRequestResponse({
    description: 'The body failed validation',
    type: ErrorResponseDto,
    example: {
      statusCode: 400,
      message: [
        'property color should not exist',
        'name should not be empty',
        'price must not be less than 0',
      ],
      error: 'Bad Request',
    },
  })
  create(@Body() dto: CreateProductDto): Product {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Partial update: send only the fields you want to change.',
  })
  @ProductIdParam()
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      price: {
        summary: 'Change the price',
        value: { price: 19.99 },
      },
      restock: {
        summary: 'Restock and rename',
        value: { name: 'Wireless Mouse (Black)', stock: 300 },
      },
    },
  })
  @ApiOkResponse({ description: 'The updated product', type: Product })
  @InvalidId()
  @NotFound()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Product {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ProductIdParam()
  @ApiNoContentResponse({ description: 'Deleted. No response body.' })
  @InvalidId()
  @NotFound()
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.productsService.remove(id);
  }
}
