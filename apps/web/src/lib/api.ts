import type { GraphQLResponse, GraphQLVehiclesData } from '@/types';

export const API_URL = process.env.API_URL || 'http://localhost:3001/graphql';

export const VEHICLES_QUERY = `
  query GetVehicles($take: Int = 9) {
    vehicles(take: $take) {
      items {
        id
        brand
        model
        imageUrl
        dailyRate
        transmission
        category {
          id
          name
        }
      }
      totalCount
    }
  }
`;

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed with status ${response.status}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0]?.message || 'GraphQL query error');
  }

  if (!json.data) {
    throw new Error('No data returned from GraphQL response');
  }

  return json.data;
}

export async function getVehicles(take = 9) {
  const data = await fetchGraphQL<GraphQLVehiclesData>(VEHICLES_QUERY, { take });
  return data.vehicles;
}
