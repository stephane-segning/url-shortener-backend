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
@ObjectType('Oauth2Client')
export class Oauth2ClientDto {
  @IDField(() => ID)
  id!: string;

  @FilterableField()
  clientId!: string;

  @FilterableField()
  clientSecret!: string;

  @Field(() => [String])
  redirectUris!: string[];

  @Field(() => [String])
  grants!: string[];

  @Field(() => [String])
  scopes!: string[];

  @FilterableField()
  name!: string;

  @FilterableField()
  description!: string;

  @FilterableField()
  accessTokenLifetime!: number;

  @FilterableField()
  refreshTokenLifetime!: number;

  @FilterableField()
  disabled!: boolean;

  @Field(() => GraphQLISODateTime)
  created!: Date;

  @Field(() => GraphQLISODateTime)
  updated!: Date;
}
