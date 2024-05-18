import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('User')
export class UsersDto {
  @IDField(() => ID)
  id!: string;

  @FilterableField()
  username!: string;

  @FilterableField()
  active!: boolean;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
