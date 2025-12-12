import { HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository } from '../repositories/iuser.repository';
import { IUserValidationService } from './iuser-validation.service';
import { AppError } from '@errors';

@Injectable()
export class UserValidationService extends IUserValidationService {
  constructor(private readonly userRepository: IUserRepository) {
    super();
  }

  async isEmailUnique(email: string): Promise<void> {
    const exists = await this.userRepository.findByEmail(email);

    if (exists)
      throw new AppError(
        `Email ${exists.email} already in use`,
        HttpStatus.CONFLICT,
        'EMAIL_ALREADY_IN_USE',
      );
  }

  async doesUserExist(id: string): Promise<void> {
    const exists = await this.userRepository.findById(id);

    if (!exists)
      throw new AppError(
        'User not found',
        HttpStatus.NOT_FOUND,
        'USER_NOT_FOUND',
      );
  }
}
