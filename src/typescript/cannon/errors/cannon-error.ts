export class CannonError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'CannonError';
  }
}
