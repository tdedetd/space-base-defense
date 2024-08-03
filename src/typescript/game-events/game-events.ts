import { GameEventCallback } from './models/game-event-callback.type';
import { GameEventParams } from './models/game-event-params.type';

export class GameEvents {
  private readonly listeners: Partial<
    Record<keyof GameEventParams, GameEventCallback<GameEventParams[keyof GameEventParams]>[]>
  > = {};

  public dispatch<K extends keyof GameEventParams>(event: K, params: GameEventParams[K]): void {
    this.listeners[event]?.forEach((callback) => {
      callback(params);
    });
  }

  public listen<K extends keyof GameEventParams>(event: K, callback: GameEventCallback<GameEventParams[K]>): void {
    // TODO: избавиться от этого позора
    const listeners = this.listeners[event] as any;
    this.listeners[event] = listeners ? [...listeners, callback] : [callback];
  }
}
