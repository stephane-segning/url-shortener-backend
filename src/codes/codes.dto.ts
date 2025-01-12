import {
  Authorize,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '@/users/user.entity';
import { Logger } from '@nestjs/common';

@Authorize({
  authorize: (context: { req: { user: UserEntity } }) => {
    Logger.debug('[CodeItem] Auth user is ' + context.req.user.id);
    return {};
  },
})
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
