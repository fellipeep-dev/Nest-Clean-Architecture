import { HttpStatus, Injectable } from '@nestjs/common';
import { AppError } from 'src/shared/errors';
import { IAuthValidationService } from './iauth-validation.service';
import { IAuthRepository } from '../../domain/repositories/iauth.repository';

@Injectable()
export class AuthValidationService implements IAuthValidationService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async doesExist(id: string): Promise<void> {
    const exists = await this.authRepository.findById(id);

    if (!exists)
      throw new AppError(
        'Auth not found',
        HttpStatus.NOT_FOUND,
        'AUTH_NOT_FOUND',
      );
  }
}
