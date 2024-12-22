import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Video extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fileOriginalName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  mimeType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serverUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  duration: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  quality: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  format: string;

  @Column({ type: 'float', nullable: false })
  rawFileSizeMB: number;

  @Column({
    type: 'number',
    nullable: false,
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.videos, {
    onDelete: 'CASCADE',
  })
  user: User;
}
