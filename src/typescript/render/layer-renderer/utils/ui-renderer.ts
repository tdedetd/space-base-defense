import { Cannon } from '../../../cannon/cannon';
import { Game } from '../../../game';
import { Measures } from './measures';

export class UiRenderer {
  private reloadingScaleOptions = {
    outerWidth: 100,
    outerHeight: 10,
    padding: 2,
    ySpacing: 20,
    color: 'rgba(255, 255, 255, 0.25)',
  };

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    private readonly measures: Measures
  ) {}

  public render(game: Game): void {
    this.renderCannonsReloadingScales(game.cannons, game.timestamp);
  }

  private renderCannonsReloadingScales(cannons: Cannon[], timestamp: number): void {
    const { outerWidth, outerHeight, ySpacing, padding } = this.reloadingScaleOptions;

    this.ctx.strokeStyle = this.reloadingScaleOptions.color;
    this.ctx.fillStyle = this.reloadingScaleOptions.color;

    cannons.forEach((cannon) => {
      const reloadingState = cannon.getReloadingState(timestamp);
      if (reloadingState.status === 'reloading') {
        const positionPx = this.measures.convertPointToPx(cannon.position);
        this.ctx.strokeRect(
          positionPx.x - outerWidth / 2,
          positionPx.y + ySpacing,
          outerWidth,
          outerHeight
        );

        this.ctx.fillRect(
          positionPx.x - outerWidth / 2 + padding,
          positionPx.y + ySpacing + padding,
          (outerWidth - padding * 2) * reloadingState.progress,
          outerHeight - padding * 2
        );
      }
    });
  }
}
