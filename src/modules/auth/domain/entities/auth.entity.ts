import { Auth } from 'src/infrastructure/database/prisma/generated/client';
import { BaseEntity } from 'src/shared/kernel';

export class AuthEntity extends BaseEntity implements Auth {
  userId!: string;
  expiresAt!: Date;
  token?: string | null;
}
