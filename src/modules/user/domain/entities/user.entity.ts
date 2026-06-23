import { User } from 'src/infrastructure/database/prisma/generated/client';
import { BaseEntity } from 'src/shared/kernel';

export class UserEntity extends BaseEntity implements User {
  name!: string;
  email!: string;
  password!: string;
  profilePictureUrl!: string | null;
}
