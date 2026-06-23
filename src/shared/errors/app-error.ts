export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number,
    public readonly errorCode: string,
  ) {
    super(message);
  }
}
