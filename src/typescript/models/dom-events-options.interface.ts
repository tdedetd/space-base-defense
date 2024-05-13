import { Game } from '../game';
import { GameRenderer } from '../game-renderer';

export interface DomEventsOptions {
  container: HTMLDivElement;
  game: Game;
  gameRenderer: GameRenderer;
}
