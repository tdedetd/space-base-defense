import { Game } from '../game';
import { Measures } from '../measures';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { formatPoint } from '../utils/format-point';
import { FpsMeter } from './fps-meter';

export class DebugRenderer {
  private readonly fpsMeter = new FpsMeter();
  private readonly fontSize = 14;
  private readonly lineSpacing = 8;
  private readonly fontStyle: string;
  private readonly hitboxColor = 'rgba(255, 255, 255, 0.5)';

  private tempLineCounter = 0;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly measures: Measures
  ) {
    this.fontStyle = `${this.fontSize}px sans-serif`;
  }

  public render(
    game: Game,
    activeScenePosition: Point | null,
    pause: boolean,
    msDiff: number
  ): void {
    this.fpsMeter.registerFrame(msDiff);
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

    this.resetLineCounter();

    const activeScenePositionStr = activeScenePosition ? formatPoint(activeScenePosition, 2) : '-';
    this.renderInfoLine(`${this.fpsMeter.getCurrent().toFixed(3)} FPS`);
    this.skipLine();

    this.renderInfoLine(`Active position: ${activeScenePositionStr}`);
    this.renderInfoLine(`Time: ${(game.timestamp / 1000).toFixed(0)}s`);
    this.renderInfoLine(`Ally projectiles: ${game.allyProjectiles.length}`);
    this.renderInfoLine(`Enemy projectiles: ${game.enemyProjectiles.length}`);
    this.renderInfoLine(`Paused: ${pause}`);
    this.renderInfoLine(`Projectiles frequency: ${(game.currentProjectilesSpawnFrequency).toFixed(2)} per second`);
    this.renderInfoLine([
      'Actual projectiles frequency:',
      String((game.statistics.enemyProjectiles / game.timestamp * 1000).toFixed(2)),
      'per second'
    ].join(' '));
    this.skipLine();

    this.renderInfoLine('------ Game statistics ------');
    this.renderInfoLine(`Shots: ${game.statistics.shots}`);
    this.renderInfoLine(`Hits: ${game.statistics.hits}`);
    this.renderInfoLine(`Enemy projectiles: ${game.statistics.enemyProjectiles}`);
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

  private renderInfoLine(text: string): void {
    this.tempLineCounter++;
    this.ctx.fillStyle = 'white';
    this.ctx.letterSpacing = '1px';
    this.ctx.font = this.fontStyle;
    this.ctx.fillText(text, 10, (this.fontSize + this.lineSpacing) * this.tempLineCounter);
  }

  private resetLineCounter(): void {
    this.tempLineCounter = 0;
  }

  private skipLine(): void {
    this.tempLineCounter++;
  }
}
