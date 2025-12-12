export abstract class IUserValidationService {
  abstract isEmailUnique(email: string): Promise<void>;
  abstract doesUserExist(id: string): Promise<void>;
}
