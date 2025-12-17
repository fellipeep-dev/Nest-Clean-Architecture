import { IValidationService } from 'src/common/abstractions/services/ivalidation.service';

export abstract class IUserValidationService implements IValidationService {
  abstract isEmailUnique(email: string): Promise<void>;
  abstract doesExist(id: string): Promise<void>;
}
