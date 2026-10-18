import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupDocs(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Full Stack App API')
    .setDescription(
      'REST API for the dockerized full stack app.\n\n' +
        'Data is currently stored **in memory** and resets on every restart. ' +
        'A few sample products are seeded on startup so you can try the ' +
        '`GET`/`PATCH`/`DELETE` endpoints right away.',
    )
    .setVersion('1.0')
    .addTag('Products', 'Create, read, update and delete products')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Raw OpenAPI spec at /openapi.json (for Postman, codegen, etc.)
  SwaggerModule.setup('docs', app, document, {
    ui: false,
    raw: ['json'],
    jsonDocumentUrl: 'openapi.json',
  });

  // Interactive Scalar reference at /docs
  app.use(
    '/docs',
    apiReference({
      content: document,
      pageTitle: 'Full Stack App API',
      theme: 'purple',
      defaultHttpClient: { targetKey: 'js', clientKey: 'fetch' },
    }),
  );
}
