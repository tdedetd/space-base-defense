import { CannonError } from './cannon-error';

export class FireWhileReloadingCannonError extends CannonError {
  constructor(message?: string) {
    super(message);
    this.name = 'FireWhileReloadingCannonError';
  }
}
