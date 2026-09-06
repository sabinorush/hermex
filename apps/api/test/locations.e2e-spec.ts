import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module.js';

describe('Locations query (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns seeded locations ordered by name', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query Locations {
            locations {
              id
              name
              address
              city
              state
            }
          }
        `,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();

    const locations = response.body.data.locations as Array<{
      id: string;
      name: string;
      address: string;
      city: string;
      state: string;
    }>;
    const names = locations.map(({ name }) => name);

    expect(locations.length).toBeGreaterThanOrEqual(3);
    expect(names).toEqual([...names].sort());
    expect(locations[0]).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      address: expect.any(String),
      city: expect.any(String),
      state: expect.stringMatching(/^[A-Z]{2}$/),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
