import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PaginatedPosts } from './interfaces/post.interface';
import ImageKit from 'imagekit';

const logger = new Logger('PostsService');

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private httpService: HttpService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    try {
      const post = this.postRepository.create({ ...createPostDto });
      const savedPost = await this.postRepository.save(post);
      return savedPost;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findAll(page = 1, limit = 10): Promise<PaginatedPosts> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder = this.postRepository.createQueryBuilder('posts');
      const posts = await queryBuilder
        .take(limit)
        .skip(offset)
        .orderBy('posts.createdAt', 'DESC')
        .cache({ enabled: true })
        .getMany();

      //pagination metadata
      const totalPosts = await queryBuilder.getCount();
      const totalPages = Math.ceil(totalPosts / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      //return posts
      const resData: PaginatedPosts = {
        data: posts.length > 0 ? posts : [],
        currentPage: page,
        hasNext,
        hasPrevious,
        size: posts.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findPostsByUser(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedPosts> {
    try {
      const offset = (page - 1) * limit;
      const queryBuilder = this.postRepository.createQueryBuilder('posts');
      const posts = await queryBuilder
        .where('posts.userId = :userId', { userId })
        .take(limit)
        .skip(offset)
        .orderBy('posts.createdAt', 'DESC')
        .cache({ enabled: true })
        .getMany();

      //pagination metadata
      const totalPosts = await queryBuilder
        .where('posts.userId = :userId', { userId })
        .getCount();
      const totalPages = Math.ceil(totalPosts / limit);
      const hasNext = page < totalPages;
      const hasPrevious = page > 1;

      //return posts
      const resData: PaginatedPosts = {
        data: posts.length > 0 ? posts : [],
        currentPage: page,
        hasNext,
        hasPrevious,
        size: posts.length,
        totalPages,
      };

      return resData;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async findOne(id: string): Promise<Post> {
    try {
      const post = await this.postRepository.findOne(id);
      if (!post) {
        throw new RpcException(`Post with #id ${id} not found`);
      }
      return post;
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async update(updatePostDto: UpdatePostDto): Promise<Post> {
    try {
      const updatedPost = await this.postRepository
        .createQueryBuilder()
        .update(Post, {
          content: updatePostDto.content,
        })
        .where('id = :id', { id: updatePostDto.id })
        .andWhere('userId = :userId', { userId: updatePostDto.userId })
        .returning('*')
        .execute();

      return updatedPost.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async remove(id: string, userId: string): Promise<Post> {
    try {
      const deletedPost = await this.postRepository
        .createQueryBuilder()
        .delete()
        .from(Post)
        .where('id = :id', { id })
        .andWhere('userId = :userId', { userId })
        .returning('*')
        .execute();
      if (Boolean(deletedPost.raw[0].imagekit_fileId)) {
        imagekit.deleteFile(deletedPost.raw[0].imagekit_fileId);
      }
      return deletedPost.raw[0];
    } catch (error) {
      logger.log('server error', error);
      throw new RpcException(error);
    }
  }

  async incrementLikes(id: string): Promise<string> {
    try {
      await this.postRepository.increment({ id }, 'numberOfLikes', 1);
      return 'Post liked';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async decrementLikes(id: string): Promise<string> {
    try {
      await this.postRepository.decrement({ id }, 'numberOfLikes', 1);
      return 'Post disliked';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async incrementComments(id: string): Promise<string> {
    try {
      await this.postRepository.increment({ id }, 'numberOfComments', 1);
      return 'Comment added';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async decrementComments(id: string): Promise<string> {
    try {
      await this.postRepository.decrement({ id }, 'numberOfComments', 1);
      return 'Comment removed from post';
    } catch (error) {
      logger.log('server error', error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Ooops! Something broke from our end. Please retry',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
