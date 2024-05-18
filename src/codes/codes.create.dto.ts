import { IsBoolean, IsString } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType('CreateCodeItem')
export class CodesCreateDto {
  @IsString()
  @Field({
    nullable: true,
  })
  smallCode?: string;

  @IsBoolean()
  @Field({ nullable: true, defaultValue: true })
  active?: boolean;

  @Field({ nullable: true })
  customScript?: string | undefined;

  @Field({ nullable: true })
  redirectUrl?: string | undefined;
}
