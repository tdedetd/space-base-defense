import { Game } from '../game';
import { Measures } from './layer-renderer/utils/measures';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { ProjectileDespawner } from '../projectile-despawner';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { CanvasesMap } from './models/canvases-map.type';
import { getContext2d } from './utils/get-context-2d';
import { GameMainStaticLayerRenderer } from './layer-renderer/game-main-static-layer-renderer';
import { LayerRenderers } from './models/layer-renderers.interface';
import { LayerRenderer } from './layer-renderer/layer-renderer';
import { GameMainLayerRenderer } from './layer-renderer/game-main-layer-renderer';
import { RenderLayerOptions } from './models/render-layer-options.interface';

export class GameRenderer {
  private readonly layerRenderers: LayerRenderers;
  private readonly despawner: ProjectileDespawner;
  private readonly _game: Game;

  private _pause = false;
  private measures = new Measures(3 / 4, 1000);

  private activeScenePosition: Point | null = null;

  public get game(): Game {
    return this._game;
  }

  public get pause(): boolean {
    return this._pause;
  }

  constructor(
    canvases: CanvasesMap,
    game: Game,
    private readonly container: HTMLDivElement
  ) {
    this._game = game;
    this.despawner = new ProjectileDespawner(this._game);

    this.layerRenderers = {
      main: new GameMainLayerRenderer(
        getContext2d(canvases.main),
        this._game,
        this.measures
      ),
      mainStatic: new GameMainStaticLayerRenderer(
        getContext2d(canvases.mainStatic),
        this._game,
        this.measures
      ),
    };
  }

  public render(msDiff: number): void {
    const renderOptions: RenderLayerOptions = {
      activeScenePosition: this.activeScenePosition,
      msDiff,
      pause: this._pause
    };

    this.layerRenderers.main.render(renderOptions);
    this.despawner.update(msDiff);
  }

  public toggleDisplayDebug(): void {
    this.layerRenderers.main.displayDebug = !this.layerRenderers.main.displayDebug;
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
    Object.values(this.layerRenderers)
      .filter((value): value is LayerRenderer => value instanceof LayerRenderer)
      .forEach((layerRenderer) => {
        layerRenderer.updateCanvasSize(this.container.clientWidth, this.container.clientHeight);
      });

    this.measures.update(this.container.clientWidth, this.container.clientHeight);

    const sceneBorders = this.getSceneBorders();
    this.despawner.setBorders(sceneBorders);
    this.game.enemyProjectilesSpawner.setBorders(sceneBorders);

    this.layerRenderers.mainStatic.render();
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
}
