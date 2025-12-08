import { AuditableEntity } from './auditable-entity';

export abstract class BaseEntity extends AuditableEntity {
  id: string;
}
