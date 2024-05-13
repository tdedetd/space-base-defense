import { Game } from './game';
import { Measures } from './measures';
import { Point } from './models/geometry/point.intarface';

export class Debug {
  private readonly fontSize = 16;
  private readonly lineSpacing = 8;
  private readonly fontStyle: string;
  private readonly hitboxColor = 'rgba(255, 255, 255, 0.5)';

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly measures: Measures
  ) {
    this.fontStyle = `${this.fontSize}px sans-serif`;
  }

  public render(
    game: Game,
    activeScenePosition: Point | null,
    pause: boolean
  ): void {
    this.renderSceneBounds();
    this.renderDebugInfo(game, activeScenePosition, pause);
  }

  private renderDebugInfo(
    game: Game,
    activeScenePosition: Point | null,
    pause: boolean
  ): void {
    this.ctx.fillStyle = 'white';
    this.ctx.letterSpacing = '1px';
    this.ctx.font = this.fontStyle;
    this.ctx.fillText(
      `Ally projectiles: ${game.allyProjectiles.length}`, 10, this.fontSize + this.lineSpacing
    );
    this.ctx.fillText(
      `Enemy projectiles: ${game.enemyProjectiles.length}`, 10, (this.fontSize + this.lineSpacing) * 2
    );
    this.ctx.fillText(
      `Paused: ${pause}`, 10, (this.fontSize + this.lineSpacing) * 3
    );

    const activeScenePositionStr = activeScenePosition
      ? `(${activeScenePosition.x.toFixed(2)}; ${activeScenePosition.y.toFixed(2)})` : '-';
    this.ctx.fillText(
      `Active scene position: ${activeScenePositionStr}`, 10, (this.fontSize + this.lineSpacing) * 4
    );
  }

  private renderSceneBounds(): void {
    this.ctx.strokeStyle = this.hitboxColor;
    this.ctx.strokeRect(
      this.measures.sceneOriginPx.x,
      this.measures.sceneOriginPx.y,
      this.measures.sceneWidthPx,
      this.measures.sceneHeightPx
    );
  }
}
