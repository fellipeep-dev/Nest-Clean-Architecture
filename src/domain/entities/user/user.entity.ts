import { BaseEntity } from 'src/common/abstractions';
import { User } from 'src/infra/database/prisma/generated/client';

export class UserEntity extends BaseEntity implements User {
  name: string;
  email: string;
  password: string;
  profilePictureUrl: string | null;
}
