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
    Logger.debug('[User] Auth user is ' + context.req.user.id);
    return {};
  },
})
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
