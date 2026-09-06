import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('Categories query (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns the seeded categories ordered by name', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query Categories {
            categories {
              id
              name
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.categories).toEqual([
      { id: expect.any(String), name: 'Hatch' },
      { id: expect.any(String), name: 'Minivan' },
      { id: expect.any(String), name: 'Picape' },
      { id: expect.any(String), name: 'SUV' },
      { id: expect.any(String), name: 'Sedan' },
    ]);
  });

  afterAll(async () => {
    await app.close();
  });
});
