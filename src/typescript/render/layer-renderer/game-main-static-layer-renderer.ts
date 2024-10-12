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
    this.renderBaseModules(this.game.base.modules);
    this.renderStaticShield();
  }

  private renderBaseModules(baseModules: BaseModule[]): void {
    const ctx = this.ctx;
    baseModules.filter(module => !module.destroyed).forEach((module) => {
      ctx.strokeStyle = '#d19c13';
      const rectanglePx = this.measures.convertRectangleToPx(module.rectangle);
      ctx.strokeRect(rectanglePx.x, rectanglePx.y, rectanglePx.width, rectanglePx.height);
    });
  }

  private renderStaticShield(): void {
    const ctx = this.ctx;
    ctx.strokeStyle = '#fff';

    this.game.staticShields.forEach((shield) => {
      const positionPx = this.measures.convertPointToPx(shield.position);
      this.ctx.beginPath();
      this.ctx.ellipse(
        positionPx.x,
        positionPx.y,
        this.measures.convertSizeToPx(shield.xRadius),
        this.measures.convertSizeToPx(shield.yRadius),
        0, 0, Math.PI * 2
      );
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }
}
