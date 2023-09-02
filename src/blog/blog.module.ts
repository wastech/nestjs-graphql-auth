import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';

@Module({
  providers: [BlogResolver, BlogService]
})
export class BlogModule {}
