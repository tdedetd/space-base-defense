import { Cannon } from './cannon/cannon';
import { Debug } from './debug';
import { Game } from './game';
import { Point } from './models/geometry/point.intarface';
import { ProjectileDespawner } from './projectile-despawner';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { CoordinateSystemConverter } from './utils/coordinate-system-converter.class';

export class GameRenderer {
  private displayDebug = true;
  private readonly debug: Debug;
  private readonly despawner: ProjectileDespawner;
  private readonly _game: Game;

  private readonly aspectRatio = 3 / 4;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sceneWidth = 1000;
  private readonly sceneHeight = this.sceneWidth * this.aspectRatio;

  private sceneWidthPx: number = 0;
  private sceneHeightPx: number = 0;
  private sceneOriginPx: Point = { x: 0, y: 0 };
  private sceneYStartPx: number = 0;

  public get game(): Game {
    return this._game;
  }

  constructor(
    private readonly container: HTMLCanvasElement,
    game: Game
  ) {
    const ctx = this.container.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get context 2d');
    }
    this.ctx = ctx;
    this._game = game;
    this.debug = new Debug(ctx);

    this.despawner = new ProjectileDespawner(this._game);
    this.despawner.run();
  }

  public render(): void {
    this.clearScene();

    this.renderBlasterProjectiles(this._game.allyProjectiles);
    this.renderBlasterProjectiles(this._game.enemyProjectiles);
    this.renderCannon(this._game.cannon);

    if (this.displayDebug) {
      this.debug.render(
        this._game,
        this.sceneWidthPx,
        this.sceneHeightPx,
        this.sceneOriginPx,
      );
    }
  }

  public rotateCannon(xPx: number, yPx: number, game: Game): void {
    const scenePoint = this.convertToScenePoint({ x: xPx, y: yPx });
    const angle = CoordinateSystemConverter.toPolar(scenePoint, game.cannon.position);
    game.setCannonRotation(angle.radians);
  }

  public toggleDisplayDebug(): void {
    this.displayDebug = !this.displayDebug;
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
    const x = -this.sceneOriginPx.x * (this.sceneWidth / this.sceneWidthPx);
    const y = -this.sceneOriginPx.y * (this.sceneHeight / this.sceneHeightPx);
    this.despawner.setBorders({
      x,
      y,
      width: this.sceneWidth + (-x * 2),
      height: this.sceneHeight + (-y * 2),
    });
  }

  private clearScene(): void {
    this.ctx.clearRect(0, 0, this.container.width, this.container.height);
  }

  private convertToPx(scenePoint: Point): Point {
    return {
      x: this.sceneOriginPx.x + (scenePoint.x / this.sceneWidth * this.sceneWidthPx),
      y: this.sceneYStartPx - (scenePoint.y / this.sceneHeight * this.sceneHeightPx),
    };
  }

  private convertToScenePoint(pointPx: Point): Point {
    return {
      x: (pointPx.x - this.sceneOriginPx.x) / this.sceneWidthPx * this.sceneWidth,
      y: (this.sceneYStartPx - pointPx.y) / this.sceneHeightPx * this.sceneHeight,
    };
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const line = projectile.getLine();
      const point1Px = this.convertToPx(line[0]);
      const point2Px = this.convertToPx(line[1]);

      this.ctx.strokeStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.moveTo(point1Px.x, point1Px.y);
      this.ctx.lineTo(point2Px.x, point2Px.y);
      this.ctx.stroke();
    });
  }

  private renderCannon(cannon: Cannon): void {
    const point2 = CoordinateSystemConverter.toCartesian(
      {
        radians: cannon.rotationRadians,
        radius: cannon.barrelLength,
      },
      cannon.position
    );
    const point1Px = this.convertToPx(cannon.position);
    const point2Px = this.convertToPx(point2);

    this.ctx.strokeStyle = 'white';
    this.ctx.beginPath();
    this.ctx.moveTo(point1Px.x, point1Px.y);
    this.ctx.lineTo(point2Px.x, point2Px.y);
    this.ctx.stroke();
  }
}
