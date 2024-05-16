export class NoIntersectionPointsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'NoIntersectionPointsError';
  }
}
