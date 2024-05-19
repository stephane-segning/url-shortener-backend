import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';
import { FilterableField } from '@ptc-org/nestjs-query-graphql';

@InputType('Oauth2ClientCreate')
export class Oauth2ClientCreateDto {
  @IsString()
  @FilterableField()
  clientId!: string;

  @IsString()
  @FilterableField()
  clientSecret!: string;

  @Field(() => [String])
  redirectUris!: string[];

  @Field(() => [String])
  grants!: string[];

  @Field(() => [String])
  scopes!: string[];

  @IsString()
  @FilterableField()
  name!: string;

  @IsString()
  @FilterableField()
  description!: string;

  @IsNumber()
  @FilterableField()
  accessTokenLifetime!: number;

  @IsNumber()
  @FilterableField()
  refreshTokenLifetime!: number;

  @IsBoolean()
  @FilterableField({ defaultValue: false })
  disabled!: boolean;
}
