import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Patch,
  UseFilters,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  PaginationPayload,
  UserPostsPaginationPayload,
} from './interfaces/post.interface';
import { AllRPCExceptionsFilter } from 'all-rpc-exception-filters';

interface deletePostPayload {
  id: string;
  userId: string;
}

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'create' })
  create(@Payload() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'findAll' })
  findAll(@Payload() payload: PaginationPayload) {
    return this.postsService.findAll(payload.page, payload.limit);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'findOne' })
  findOne(@Payload() id: string) {
    return this.postsService.findOne(id);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'findUserPosts' })
  findUserPosts(@Payload() payload: UserPostsPaginationPayload) {
    return this.postsService.findPostsByUser(
      payload.userId,
      payload.page,
      payload.limit,
    );
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'update' })
  update(@Payload() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto);
  }

  @UseFilters(new AllRPCExceptionsFilter())
  @MessagePattern({ role: 'posts', cmd: 'delete' })
  remove(@Payload() payload: deletePostPayload) {
    return this.postsService.remove(payload.id, payload.userId);
  }

  @Patch('posts/likes/:id')
  @HttpCode(200)
  async incrementLikesCount(@Param('id') id: string) {
    return this.postsService.incrementLikes(id);
  }

  @Delete('posts/likes/:id')
  @HttpCode(200)
  async decrementLikesCount(@Param('id') id: string) {
    return this.postsService.decrementLikes(id);
  }

  @Patch('posts/comments/:id')
  @HttpCode(200)
  async incrementCommentsCount(@Param('id') id: string) {
    return this.postsService.incrementComments(id);
  }

  @Delete('posts/comments/:id')
  @HttpCode(200)
  async decrementCommentsCount(@Param('id') id: string) {
    return this.postsService.decrementComments(id);
  }
}
