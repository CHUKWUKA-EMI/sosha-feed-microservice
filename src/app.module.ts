import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllHttpExceptionsFilter } from 'all-http-exception-filters';
import ORMCONFIG from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORMCONFIG), PostsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllHttpExceptionsFilter,
    },
  ],
})
export class AppModule {}
