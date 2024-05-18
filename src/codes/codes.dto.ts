import { FilterableField, IDField } from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('CodeItem')
export class CodesDto {
  @IDField(() => ID)
  id!: string;

  @FilterableField()
  smallCode!: string;

  @FilterableField()
  active!: boolean;

  @Field({ nullable: true })
  customScript?: string | undefined;

  @FilterableField({ nullable: true })
  redirectUrl?: string | undefined;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
