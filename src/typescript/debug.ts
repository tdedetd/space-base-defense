import { Game } from './game';
import { Point } from './models/geometry/point.intarface';

export class Debug {
  private readonly fontSize = 16;
  private readonly lineSpacing = 8;
  private readonly fontStyle: string;

  constructor(private readonly ctx: CanvasRenderingContext2D) {
    this.fontStyle = `${this.fontSize}px sans-serif`;
  }

  public render(
    game: Game,
    sceneWidthPx: number,
    sceneHeightPx: number,
    sceneOriginPx: Point,
    activeScenePosition: Point | null,
    pause: boolean
  ): void {
    this.renderSceneBounds(sceneWidthPx, sceneHeightPx, sceneOriginPx);
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

  private renderSceneBounds(
    sceneWidthPx: number,
    sceneHeightPx: number,
    sceneOriginPx: Point,
  ): void {
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(sceneOriginPx.x, sceneOriginPx.y, sceneWidthPx, sceneHeightPx);
  }
}
