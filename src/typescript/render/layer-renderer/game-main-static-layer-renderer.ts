import { BaseModule } from '../../base/base-module';
import { Game } from '../../game';
import { Measures } from './utils/measures';
import { LayerRenderer } from './layer-renderer';

export class GameMainStaticLayerRenderer extends LayerRenderer {
  constructor(ctx: CanvasRenderingContext2D, game: Game, measures: Measures) {
    super(ctx, game, measures);

    this.game.events.listen('destroyModule', () => {
      this.render();
    });
  }

  public render(): void {
    this.clearContext();
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
}
