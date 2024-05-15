import { Game } from '../game';
import { GameRenderer } from '../render/game-renderer';

export interface DomEventsOptions {
  container: HTMLDivElement;
  game: Game;
  gameRenderer: GameRenderer;
}
