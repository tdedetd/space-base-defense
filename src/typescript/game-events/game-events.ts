import { GameEventListeners } from './models/game-event-listeners.type';
import { GameEventTypes } from './models/game-event-types.enum';

export class GameEvents {
  private listeners: GameEventListeners = {
    destroyModule: [],
  };

  public dispatch(event: GameEventTypes): void {
    this.listeners[event].forEach((callback) => {
      callback();
    });
  }

  public listen(event: GameEventTypes, callback: () => void): void {
    this.listeners[event].push(callback);
  }
}
