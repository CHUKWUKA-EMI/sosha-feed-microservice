/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { config } from 'dotenv';
import * as fs from 'fs';

config();

const ORMCONFIG: TypeOrmModuleOptions = {
  type: 'cockroachdb' || 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  cert: fs.readFileSync('./root.crt').toString(),
  ssl: { rejectUnauthorized: false },
  extra: {
    options:
      process.env.NODE_ENV === 'production' ? '--cluster=sosha-posts-1017' : '',
  },
  cache: true,
  synchronize: false,
  logging: true,
  migrationsRun: false,
  entities: [Post],
  migrations: ['dist/src/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};

export default ORMCONFIG;
