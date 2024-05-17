import { GameRenderer } from './render/game-renderer';

export class Tick {
  private gameRenderer: GameRenderer | null = null;

  public run(startTimestamp: number): void {
    let lastTimestampMs = startTimestamp;

    const tick = (currentTimestamp: number): void => {
      const diffMs = currentTimestamp - lastTimestampMs;
      lastTimestampMs = currentTimestamp;

      if (this.gameRenderer) {
        if (!this.gameRenderer.pause) {
          this.gameRenderer.game.update(diffMs);
        }
        this.gameRenderer.render(diffMs);
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  public resetGameRenderer(): void {
    this.gameRenderer = null;
  }

  public setGameRenderer(gameRenderer: GameRenderer): void {
    this.gameRenderer = gameRenderer;
  }
}
