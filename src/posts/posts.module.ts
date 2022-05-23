import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), HttpModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
