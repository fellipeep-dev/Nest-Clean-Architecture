export abstract class IValidationService {
  abstract doesExist(id: string): Promise<void>;
}
