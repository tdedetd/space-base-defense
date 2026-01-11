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

  public abstract render(options: RenderLayerOptions): void;

  public updateCanvasSize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }
}
