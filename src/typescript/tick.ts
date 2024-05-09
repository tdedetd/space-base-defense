import { Game } from './game';
import { GameRenderer } from './game-renderer';

export class Tick {
  private game: Game | null = null;

  constructor(private readonly gameRenderer: GameRenderer) {}

  public setGame(game: Game): void {
    this.game = game;
  }

  public run(startTimestamp: number): void {
    let lastTimestampMs = startTimestamp;

    const tick = (currentTimestamp: number) => {
      const diffMs = currentTimestamp - lastTimestampMs;
      lastTimestampMs = currentTimestamp;

      if (this.game) {
        this.game.moveProjectiles(diffMs);
        this.gameRenderer.render(this.game);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
