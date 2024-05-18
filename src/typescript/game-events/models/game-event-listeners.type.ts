import { GameEventTypes } from './game-event-types.enum';

export type GameEventListeners = Record<GameEventTypes, (() => void)[]>;
