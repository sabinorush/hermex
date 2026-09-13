import type {
  GraphQLHomeData,
  GraphQLResponse,
  GraphQLSearchVehiclesData,
  GraphQLVehiclesData,
  SearchVehiclesInput,
} from '@/types';

export const API_URL = process.env.API_URL || 'http://localhost:3001/graphql';

export const VEHICLES_QUERY = `
  query GetVehicles($take: Int = 9, $categoryId: ID) {
    vehicles(take: $take, categoryId: $categoryId) {
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

export const HOME_QUERY = `
  query GetHome($take: Int = 9) {
    categories {
      id
      name
    }
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

export const SEARCH_VEHICLES_QUERY = `
  query SearchVehicles($input: SearchVehiclesInput!) {
    searchVehicles(input: $input) {
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

function getGraphQLEndpoint() {
  return typeof window === 'undefined' ? API_URL : '/api/graphql';
}

export async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(getGraphQLEndpoint(), {
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

export async function getVehicles(take = 9, categoryId?: string) {
  const data = await fetchGraphQL<GraphQLVehiclesData>(VEHICLES_QUERY, {
    take,
    categoryId,
  });
  return data.vehicles;
}

export async function searchVehicles(input: SearchVehiclesInput) {
  const data = await fetchGraphQL<GraphQLSearchVehiclesData>(SEARCH_VEHICLES_QUERY, { input });
  return data.searchVehicles;
}

export function getHomeData(take = 9) {
  return fetchGraphQL<GraphQLHomeData>(HOME_QUERY, { take });
}
