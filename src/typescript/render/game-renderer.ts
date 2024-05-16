import { BaseModule } from '../base/base-module';
import { Cannon } from '../cannon/cannon';
import { DebugRenderer } from './debug-renderer';
import { Game } from '../game';
import { Measures } from '../measures';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { ProjectileDespawner } from '../projectile-despawner';
import { BlasterProjectile } from '../projectile/blaster-projectile';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { UiRenderer } from './ui-renderer';

export class GameRenderer {
  private readonly debugRenderer: DebugRenderer;
  private readonly uiRenderer: UiRenderer;

  private displayDebug = true;
  private readonly despawner: ProjectileDespawner;
  private readonly _game: Game;
  private _pause = false;
  private measures = new Measures(3 / 4, 1000);

  private readonly ctx: CanvasRenderingContext2D;

  private activeScenePosition: Point | null = null;

  public get game(): Game {
    return this._game;
  }

  public get pause(): boolean {
    return this._pause;
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

    this.debugRenderer = new DebugRenderer(ctx, this.measures);
    this.uiRenderer = new UiRenderer(ctx, this.measures);

    this.despawner = new ProjectileDespawner(this._game);
    this.despawner.run();
  }

  public render(msDiff: number): void {
    this.clearScene();

    this.renderBlasterProjectiles(this._game.enemyProjectiles);
    this.renderBlasterProjectiles(this._game.allyProjectiles);
    this.renderBaseModules(this._game.baseModules);
    this.renderCannons(this._game.cannons);

    this.uiRenderer.render(this._game);

    if (this.displayDebug) {
      this.debugRenderer.render(this._game, this.activeScenePosition, this._pause, msDiff);
    }
  }

  public toggleDisplayDebug(): void {
    this.displayDebug = !this.displayDebug;
  }

  public togglePause(): void {
    this._pause = !this._pause;
  }

  public setActiveScenePosition(xPx: number, yPx: number): void {
    this.activeScenePosition = this.measures.convertPointToScenePoint({ x: xPx, y: yPx });
  }

  public updateCannonRotation(): void {
    if (this.activeScenePosition && !this.pause) {
      for (const cannon of this.game.cannons) {
        const pointPolar = CoordinateSystemConverter.toPolar(this.activeScenePosition, cannon.position);
        cannon.setRotation(pointPolar.radians);
      }
    }
  }

  public updateSceneMeasures(): void {
    this.container.width = this.container.clientWidth;
    this.container.height = this.container.clientHeight;

    this.measures.update(this.container.width, this.container.height);

    const x = -this.measures.sceneOriginPx.x * (this.measures.sceneWidth / this.measures.sceneWidthPx);
    const y = -this.measures.sceneOriginPx.y * (this.measures.sceneHeight / this.measures.sceneHeightPx);

    const sceneBorders: Rectangle = {
      x,
      y,
      width: this.measures.sceneWidth + (-x * 2),
      height: this.measures.sceneHeight + (-y * 2),
    };
    this.despawner.setBorders(sceneBorders);
    this.game.enemyProjectilesSpawner.setBorders(sceneBorders);
  }

  private clearScene(): void {
    this.ctx.clearRect(0, 0, this.container.width, this.container.height);
  }

  private renderBaseModules(baseModules: BaseModule[]): void {
    baseModules.filter(module => !module.destroyed).forEach((module) => {
      this.ctx.strokeStyle = '#d19c13';
      const rectanglePx = this.measures.convertRectangleToPx(module.rectangle);
      this.ctx.strokeRect(rectanglePx.x, rectanglePx.y, rectanglePx.width, rectanglePx.height);
    });
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const line = projectile.getLine();
      const point1Px = this.measures.convertPointToPx(line[0]);
      const point2Px = this.measures.convertPointToPx(line[1]);

      this.ctx.strokeStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.moveTo(point1Px.x, point1Px.y);
      this.ctx.lineTo(point2Px.x, point2Px.y);
      this.ctx.stroke();
    });
  }

  private renderCannons(cannons: Cannon[]): void {
    cannons.forEach((cannon) => {
      const point2 = CoordinateSystemConverter.toCartesian(
        {
          radians: cannon.rotationRadians,
          radius: cannon.barrelLength,
        },
        cannon.position
      );
      const point1Px = this.measures.convertPointToPx(cannon.position);
      const point2Px = this.measures.convertPointToPx(point2);

      this.ctx.strokeStyle = '#d19c13';
      this.ctx.beginPath();
      this.ctx.moveTo(point1Px.x, point1Px.y);
      this.ctx.lineTo(point2Px.x, point2Px.y);
      this.ctx.stroke();
    });
  }
}
