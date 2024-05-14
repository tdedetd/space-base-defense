import { Game } from './game';
import { Measures } from './measures';
import { Point } from './models/geometry/point.intarface';
import { Rectangle } from './models/geometry/rectangle.interface';
import { formatPoint } from './utils/format-point';

export class Debug {
  private readonly fontSize = 14;
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
    this.renderBaseHitbox(game.base.getBorders());
    this.renderDebugInfo(game, activeScenePosition, pause);
  }

  private renderBaseHitbox(hitbox: Rectangle): void {
    this.ctx.strokeStyle = this.hitboxColor;
    const rectacangle = this.measures.convertRectangleToPx(hitbox);
    this.ctx.strokeRect(rectacangle.x, rectacangle.y, rectacangle.width, rectacangle.height);
  }

  private renderDebugInfo(
    game: Game,
    activeScenePosition: Point | null,
    pause: boolean
  ): void {
    this.ctx.fillStyle = 'white';
    this.ctx.letterSpacing = '1px';
    this.ctx.font = this.fontStyle;

    const activeScenePositionStr = activeScenePosition ? formatPoint(activeScenePosition, 2) : '-';
    this.renderInfoLine(1, `Active position: ${activeScenePositionStr}`);
    this.renderInfoLine(2, `Time: ${(game.msFromStart / 1000).toFixed(0)}s`);
    this.renderInfoLine(3, `Ally projectiles: ${game.allyProjectiles.length}`);
    this.renderInfoLine(4, `Enemy projectiles: ${game.enemyProjectiles.length}`);
    this.renderInfoLine(5, `Paused: ${pause}`);
    this.renderInfoLine(6, `Projectiles frequency: ${(game.currentProjectilesSpawnFrequency).toFixed(2)} per second`);
    this.renderInfoLine(7, [
      'Actual projectiles frequency:',
      String((game.statistics.enemyProjectiles / game.msFromStart * 1000).toFixed(2)),
      'per second'
    ].join(' '));

    this.renderInfoLine(9, '------ Game statistics ------');
    this.renderInfoLine(10, `Shots: ${game.statistics.shots}`);
    this.renderInfoLine(11, `Hits: ${game.statistics.hits}`);
    this.renderInfoLine(12, `Enemy projectiles: ${game.statistics.enemyProjectiles}`);
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

  private renderInfoLine(line: number, text: string): void {
    this.ctx.fillStyle = 'white';
    this.ctx.letterSpacing = '1px';
    this.ctx.font = this.fontStyle;
    this.ctx.fillText(text, 10, (this.fontSize + this.lineSpacing) * line);
  }
}
