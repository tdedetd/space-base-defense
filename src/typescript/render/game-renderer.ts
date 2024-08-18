import { Game } from '../game';
import { Measures } from './layer-renderer/utils/measures';
import { Point } from '../models/geometry/point.intarface';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { getContext2d } from './utils/get-context-2d';
import { GameMainStaticLayerRenderer } from './layer-renderer/game-main-static-layer-renderer';
import { LayerRenderers } from './models/layer-renderers.interface';
import { LayerRenderer } from './layer-renderer/layer-renderer';
import { GameMainLayerRenderer } from './layer-renderer/game-main-layer-renderer';
import { RenderLayerOptions } from './models/render-layer-options.interface';
import { GameInterval } from '../game-interval';
import { EffectsLayerRenderer } from './layer-renderer/effects-layer-renderer';

export class GameRenderer {
  private readonly layers: LayerRenderers;
  private readonly _game: Game;

  private _pause = false;
  private measures = new Measures(3 / 4, 1000);
  private clearInterval = new GameInterval(() => {}, 1000000);

  private activeScenePosition: Point | null = null;

  public get game(): Game {
    return this._game;
  }

  public get pause(): boolean {
    return this._pause;
  }

  public set pause(value: boolean) {
    this._pause = value;
  }

  constructor(
    canvases: Record<keyof LayerRenderers, HTMLCanvasElement>,
    game: Game,
    private readonly container: HTMLDivElement
  ) {
    this._game = game;

    this.layers = {
      effects: new EffectsLayerRenderer(
        getContext2d(canvases.effects),
        this.game,
        this.measures
      ),
      main: new GameMainLayerRenderer(
        getContext2d(canvases.main),
        this.game,
        this.measures
      ),
      mainStatic: new GameMainStaticLayerRenderer(
        getContext2d(canvases.mainStatic),
        this.game,
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

    this.layers.main.render(renderOptions);
    this.layers.effects.render(renderOptions);
    this.clearInterval.update(msDiff);
  }

  public toggleDisplayDebug(): void {
    this.layers.main.displayDebug = !this.layers.main.displayDebug;
  }

  public togglePause(): void {
    this._pause = !this._pause;
  }

  public setActiveScenePosition(xPx: number, yPx: number): void {
    this.activeScenePosition = this.measures.convertPointPxToScenePoint({ x: xPx, y: yPx });
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
    Object.values(this.layers)
      .filter((value): value is LayerRenderer => value instanceof LayerRenderer)
      .forEach((layerRenderer) => {
        layerRenderer.updateCanvasSize(this.container.clientWidth, this.container.clientHeight);
      });

    this.measures.update(this.container.clientWidth, this.container.clientHeight);
    const sceneBorders = this.measures.getSceneBorders();

    this.clearInterval = new GameInterval(() => {
      this.game.clearProjectilesOutside(sceneBorders);
    }, 1000);

    this.game.enemyProjectilesSpawner.setBorders(sceneBorders);

    this.layers.mainStatic.render();
  }
}
