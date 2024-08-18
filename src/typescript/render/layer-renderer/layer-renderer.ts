import { Game } from '../../game';
import { Measures } from './utils/measures';
import { RenderLayerOptions } from '../models/render-layer-options.interface';

export abstract class LayerRenderer {
  constructor(
    protected readonly ctx: CanvasRenderingContext2D,
    protected readonly game: Game,
    protected readonly measures: Measures,
  ) {}

  public clearContext(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public render(options: RenderLayerOptions): void {
    throw new Error('method is not implemented');
  }

  public updateCanvasSize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }
}
