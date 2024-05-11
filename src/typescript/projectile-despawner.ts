import { Game } from './game';
import { Rectangle } from './models/geometry/rectangle.interface';

export class ProjectileDespawner {
  private intervalId: number | null = null;
  private borders: Rectangle | null = null;

  constructor(private readonly game: Game) {}

  public run(): void {
    this.intervalId = setInterval(() => {
      if (this.borders) {
        this.game.clearProjectilesOutside(this.borders);
      }
    }, 5000, '');
  }

  public setBorders(borders: Rectangle): void {
    if (borders.width < 0 || borders.height < 0) {
      throw new Error(`Rectangle has negative sizes (${borders.width}; ${borders.height})`);
    }
    this.borders = borders;
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
