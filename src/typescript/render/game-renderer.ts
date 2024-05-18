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
import { CanvasContexts } from './models/canvas-contexts.type';
import { CanvasesMap } from './models/canvases-map.type';
import { getContext2d } from './utils/get-context-2d';
import { clearContext } from './utils/clear-context';
import { GameEventTypes } from '../game-events/models/game-event-types.enum';

export class GameRenderer {
  private readonly debugRenderer: DebugRenderer;
  private readonly uiRenderer: UiRenderer;

  private displayDebug = true;
  private readonly despawner: ProjectileDespawner;
  private readonly _game: Game;
  private _pause = false;
  private measures = new Measures(3 / 4, 1000);

  private readonly ctx: CanvasContexts;

  private activeScenePosition: Point | null = null;

  public get game(): Game {
    return this._game;
  }

  public get pause(): boolean {
    return this._pause;
  }

  constructor(canvases: CanvasesMap, game: Game) {
    this.ctx = {
      mainStatic: getContext2d(canvases.mainStatic),
      main: getContext2d(canvases.main),
    };
    this._game = game;

    this.debugRenderer = new DebugRenderer(this.ctx.main, this.measures);
    this.uiRenderer = new UiRenderer(this.ctx.main, this.measures);
    this.despawner = new ProjectileDespawner(this._game);
  }

  public render(msDiff: number): void {
    clearContext(this.ctx.main);

    this.renderBlasterProjectiles(this._game.enemyProjectiles);
    this.renderBlasterProjectiles(this._game.allyProjectiles);
    this.renderCannons(this._game.cannons);

    this.uiRenderer.render(this._game);

    if (this.displayDebug) {
      this.debugRenderer.render(this._game, this.activeScenePosition, this._pause, msDiff);
    }

    this.despawner.update(msDiff);
    this.listenEvents();
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
    Object.entries(this.ctx).forEach(([_, ctx]) => {
      ctx.canvas.width = ctx.canvas.clientWidth;
      ctx.canvas.height = ctx.canvas.clientHeight;
    });

    this.measures.update(this.ctx.main.canvas.width, this.ctx.main.canvas.height);

    const sceneBorders = this.getSceneBorders();
    this.despawner.setBorders(sceneBorders);
    this.game.enemyProjectilesSpawner.setBorders(sceneBorders);

    this.renderStatic();
  }

  private getSceneBorders(): Rectangle {
    const x = -this.measures.sceneOriginPx.x * (this.measures.sceneWidth / this.measures.sceneWidthPx);
    const y = -this.measures.sceneOriginPx.y * (this.measures.sceneHeight / this.measures.sceneHeightPx);

    return {
      x,
      y,
      width: this.measures.sceneWidth + (-x * 2),
      height: this.measures.sceneHeight + (-y * 2),
    };
  }

  private listenEvents(): void {
    this._game.events.listen(GameEventTypes.DestroyModule, () => {
      this.renderStatic();
    });
  }

  private renderStatic(): void {
    clearContext(this.ctx.mainStatic);
    this.renderBaseModules(this._game.baseModules);
  }

  private renderBaseModules(baseModules: BaseModule[]): void {
    const ctx = this.ctx.mainStatic;
    baseModules.filter(module => !module.destroyed).forEach((module) => {
      ctx.strokeStyle = '#d19c13';
      const rectanglePx = this.measures.convertRectangleToPx(module.rectangle);
      ctx.strokeRect(rectanglePx.x, rectanglePx.y, rectanglePx.width, rectanglePx.height);
    });
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const line = projectile.getLine();
      const point1Px = this.measures.convertPointToPx(line[0]);
      const point2Px = this.measures.convertPointToPx(line[1]);

      this.ctx.main.strokeStyle = projectile.color;
      this.ctx.main.beginPath();
      this.ctx.main.moveTo(point1Px.x, point1Px.y);
      this.ctx.main.lineTo(point2Px.x, point2Px.y);
      this.ctx.main.stroke();
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

      this.ctx.main.strokeStyle = '#d19c13';
      this.ctx.main.beginPath();
      this.ctx.main.moveTo(point1Px.x, point1Px.y);
      this.ctx.main.lineTo(point2Px.x, point2Px.y);
      this.ctx.main.stroke();
    });
  }
}
