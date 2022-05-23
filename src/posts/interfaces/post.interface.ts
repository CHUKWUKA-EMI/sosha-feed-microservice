/* eslint-disable prettier/prettier */
import { Post } from '../entities/post.entity';

export interface PaginatedPosts {
  data: Post[];
  currentPage: number;
  size: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginationPayload {
  page?: number;
  limit?: number;
}

export interface UserPostsPaginationPayload extends PaginationPayload {
  userId: string;
}
