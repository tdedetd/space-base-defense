import { Game } from './game';
import { GameRenderer } from './game-renderer';

export class Tick {
  private game: Game | null = null;
  private gameRenderer: GameRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.gameRenderer = new GameRenderer(canvas);
  }

  public run(): void {
    let lastTimestampMs = 0;

    const tick = (currentTimestamp: number) => {
      const diffMs = currentTimestamp - lastTimestampMs;
      lastTimestampMs = currentTimestamp;

      if (this.game) {
        this.game.moveAllProjectiles(diffMs);
        this.gameRenderer.render(this.game);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}
