import { IsBoolean, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateUserInput')
export class UsersCreateDto {
  @IsString()
  @Field()
  username!: string;

  @IsBoolean()
  @Field()
  active!: boolean;
}
