import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity';
import { NumberTransformer } from 'src/config/custom-transformer.config';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AuthProvider } from '../data/auth-provider.enum';
import { UserTypes } from '../data/user-type.enum';
import { LoginLog } from 'src/modules/auth/entities/login-log.entity';
import { Video } from 'src/modules/video/entities/video.entity';
@Entity()
export class User extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  username: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsString()
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  avatarUrl: string;

  @OneToMany(() => LoginLog, (loginLog) => loginLog.user, {
    cascade: true,
  })
  loginLog: LoginLog[];

  @Column({ type: 'bool', nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ type: 'bool', nullable: false, default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  code: string;

  @Column({
    type: 'numeric',
    nullable: true,
    transformer: new NumberTransformer(),
  })
  codeExpiredAt: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hash: string;

  @Column({
    type: 'enum',
    enum: UserTypes,
    nullable: false,
    default: UserTypes.USER,
  })
  userType: string;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    nullable: false,
    default: AuthProvider.EMAIL,
  })
  authProvider: string;

  @OneToMany(() => Video, (video) => video.user, {
    cascade: true,
  })
  videos: Video[];
}
