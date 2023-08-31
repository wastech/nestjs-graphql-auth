// user.input.ts

import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@InputType()
export class UserInput {
  @IsOptional() // This allows the field to be optional during updates
  @IsString()
  @Field({ nullable: true })
  name?: string;

  @IsOptional() // This allows the field to be optional during updates
  @IsEmail()
  @Field({ nullable: true })
  email?: string;
}
