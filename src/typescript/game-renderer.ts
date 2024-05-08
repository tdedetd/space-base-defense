import { Game } from './game';

export class GameRenderer {
  private readonly aspectRatio = 3 / 4;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly container: HTMLCanvasElement) {
    const ctx = this.container.getContext('2d');

    if (!ctx) {
      throw new Error('Cannot get context 2d');
    }

    this.ctx = ctx;
  }

  public render(game: Game): void {

  }
}
