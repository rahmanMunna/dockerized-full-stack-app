import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 404, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 'Product with id "8f1c2a4e-3b5d-4e6f-9a7b-1c2d3e4f5a6b" not found',
    description:
      'Error message. Validation errors (400) return an array of messages.',
  })
  message: string | string[];

  @ApiProperty({ example: 'Not Found', description: 'HTTP status text' })
  error: string;
}
