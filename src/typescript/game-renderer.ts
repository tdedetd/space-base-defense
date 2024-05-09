import { Game } from './game';
import { Point } from './models/geometry/point.intarface';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { CoordinateSystemConverter } from './utils/coordinate-system-converter.class';

export class GameRenderer {
  private readonly debug = true;

  private readonly aspectRatio = 3 / 4;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sceneWidth = 1000;
  private readonly sceneHeight = this.sceneWidth * this.aspectRatio;

  private sceneWidthPx: number = 0;
  private sceneHeightPx: number = 0;
  private sceneOriginPx: Point = { x: 0, y: 0 };
  private sceneYStartPx: number = 0;

  constructor(private readonly container: HTMLCanvasElement) {
    const ctx = this.container.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get context 2d');
    }
    this.ctx = ctx;
  }

  public updateSceneMeasures(): void {
    this.container.width = this.container.clientWidth;
    this.container.height = this.container.clientHeight;
    const { width, height } = this.container;

    if (width * this.aspectRatio < height) {
      this.sceneWidthPx = width;
      this.sceneHeightPx = Math.round(width * this.aspectRatio);
      this.sceneOriginPx = {
        x: 0,
        y: Math.round(height / 2 - this.sceneHeightPx / 2),
      };
    } else {
      this.sceneWidthPx = Math.round(height / this.aspectRatio);
      this.sceneHeightPx = height;
      this.sceneOriginPx = {
        x: Math.round(width / 2 - this.sceneWidthPx / 2),
        y: 0,
      };
    }

    this.sceneYStartPx = this.sceneOriginPx.y + this.sceneHeightPx;
  }

  public render(game: Game): void {
    this.clearScene();
    this.renderBlasterProjectiles(game.allyProjectiles);
    this.renderBlasterProjectiles(game.enemyProjectiles);

    if (this.debug) {
      this.renderSceneBounds();
    }
  }

  private clearScene(): void {
    this.ctx.clearRect(0, 0, this.container.width, this.container.height);
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const point1 = CoordinateSystemConverter.toCartesian(projectile.position, projectile.origin);

      const point2Radius = projectile.position.radius + (
        projectile.direction === 'fromCenter' ? -projectile.length : projectile.length
      );
      const point2 = CoordinateSystemConverter.toCartesian({
        radians: projectile.position.radians,
        radius: point2Radius >= 0 ? point2Radius : 0,
      }, projectile.origin);

      this.ctx.strokeStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.moveTo(
        this.sceneOriginPx.x + (point1.x / this.sceneWidth * this.sceneWidthPx),
        this.sceneYStartPx - (point1.y / this.sceneHeight * this.sceneHeightPx),
      );
      this.ctx.lineTo(
        this.sceneOriginPx.x + (point2.x / this.sceneWidth * this.sceneWidthPx),
        this.sceneYStartPx - (point2.y / this.sceneHeight * this.sceneHeightPx),
      );
      this.ctx.stroke();
    });
  }

  private renderSceneBounds(): void {
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(this.sceneOriginPx.x, this.sceneOriginPx.y, this.sceneWidthPx, this.sceneHeightPx);
  }
}
