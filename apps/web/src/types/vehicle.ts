export type Transmission = 'AUTOMATIC' | 'MANUAL';

export type GraphQLCategory = {
  id: string;
  name: string;
};

export type GraphQLVehicle = {
  id: string;
  brand: string;
  model: string;
  imageUrl: string | null;
  dailyRate: number;
  transmission: Transmission;
  category: GraphQLCategory;
};

export type GraphQLVehiclesData = {
  vehicles: {
    items: GraphQLVehicle[];
    totalCount: number;
  };
};

export type GraphQLCategoriesData = {
  categories: GraphQLCategory[];
};

export type GraphQLHomeData = GraphQLCategoriesData & GraphQLVehiclesData;

export type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};
