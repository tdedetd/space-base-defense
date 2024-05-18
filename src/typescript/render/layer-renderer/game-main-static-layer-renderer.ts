import { BaseModule } from '../../base/base-module';
import { Game } from '../../game';
import { GameEventTypes } from '../../game-events/models/game-event-types.enum';
import { Measures } from './utils/measures';
import { LayerRenderer } from './layer-renderer';
import { clearContext } from '../utils/clear-context';

export class GameMainStaticLayerRenderer extends LayerRenderer {
  constructor(ctx: CanvasRenderingContext2D, game: Game, measures: Measures) {
    super(ctx, game, measures);
    this.listenEvents();
  }

  public render(): void {
    clearContext(this.ctx);
    this.renderBaseModules(this.game.baseModules);
  }

  private renderBaseModules(baseModules: BaseModule[]): void {
    const ctx = this.ctx;
    baseModules.filter(module => !module.destroyed).forEach((module) => {
      ctx.strokeStyle = '#d19c13';
      const rectanglePx = this.measures.convertRectangleToPx(module.rectangle);
      ctx.strokeRect(rectanglePx.x, rectanglePx.y, rectanglePx.width, rectanglePx.height);
    });
  }

  private listenEvents(): void {
    this.game.events.listen(GameEventTypes.DestroyModule, () => {
      this.render();
    });
  }
}
