import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class SearchVehiclesInput {
  @Field(() => ID)
  pickupLocationId: string;

  @Field(() => ID)
  returnLocationId: string;

  @Field()
  pickupDate: Date;

  @Field()
  returnDate: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => Int, { nullable: true })
  skip?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}
