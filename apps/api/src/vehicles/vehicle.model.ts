import { Field, Float, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Category } from '../categories/category.model.js';

export enum Transmission {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

registerEnumType(Transmission, { name: 'Transmission' });

@ObjectType()
export class Vehicle {
  @Field(() => ID)
  id: string;

  @Field()
  brand: string;

  @Field()
  model: string;

  @Field(() => Int)
  year: number;

  @Field()
  licensePlate: string;

  @Field(() => Float)
  dailyRate: number;

  @Field()
  available: boolean;

  @Field(() => String, { nullable: true })
  imageUrl: string | null;

  @Field(() => Transmission)
  transmission: Transmission;

  @Field(() => Category)
  category: Category;
}
