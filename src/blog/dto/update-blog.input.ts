import { CreateBlogInput } from './create-blog.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBlogInput extends PartialType(CreateBlogInput) {
  @Field(() => Int)
  id: number;
}
