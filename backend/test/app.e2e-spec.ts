import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('ProductController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/product').expect(200);
    expect(res.body).toHaveLength(3);
  });

  it('/product (POST) adds a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/product')
      .send({ name: 'Keyboard', price: 49.5, qty: 7 })
      .expect(201);

    expect(res.body).toEqual({
      message: 'product has been added',
      product: { id: 4, name: 'Keyboard', price: 49.5, qty: 7 },
    });

    const list = await request(app.getHttpServer()).get('/product').expect(200);
    expect(list.body).toContainEqual(res.body.product);
  });

  afterEach(async () => {
    await app.close();
  });
});
