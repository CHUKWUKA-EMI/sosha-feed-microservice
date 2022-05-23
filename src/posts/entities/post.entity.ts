import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'posts' })
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { nullable: true })
  content?: string;

  @Column({ nullable: true })
  imgUrl?: string;

  @Column({ nullable: true })
  videoUrl?: string;

  @Column({ nullable: true })
  imagekit_fileId?: string;

  @Index()
  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  userFirstName: string;

  @Column({ nullable: false })
  userLastName: string;

  @Column({ nullable: false })
  userName: string;

  @Column({ nullable: true })
  userImageUrl?: string;

  @Column({ default: 0 })
  numberOfLikes: number;

  @Column({ default: 0 })
  numberOfComments: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
