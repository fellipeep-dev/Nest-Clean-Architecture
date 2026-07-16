import { CreateAuthDto } from '../../presentation/dtos/create-auth.dto';

export const createAuthDtoMock: CreateAuthDto = {
  userId: 'string',
  expiresAt: new Date(),
};
