import { IValidationService } from 'src/common/abstractions/services/ivalidation.service';

export abstract class IUserValidationService extends IValidationService {
  abstract isEmailUnique(email: string): Promise<void>;
}
