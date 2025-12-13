export abstract class AuditableEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
