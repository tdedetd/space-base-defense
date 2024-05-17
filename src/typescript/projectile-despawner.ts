import { Game } from './game';
import { Rectangle } from './models/geometry/rectangle.interface';

export class ProjectileDespawner {
  private readonly intervalMs = 1000;
  private msCounter = 0;

  private borders: Rectangle | null = null;

  constructor(private readonly game: Game) {}

  public setBorders(borders: Rectangle): void {
    if (borders.width < 0 || borders.height < 0) {
      throw new Error(`Rectangle has negative sizes (${borders.width}; ${borders.height})`);
    }
    this.borders = borders;
  }

  public update(msDiff: number): void {
    this.msCounter += msDiff;
    if (this.msCounter / this.intervalMs >= 1) {
      this.msCounter %= this.intervalMs;

      if (this.borders) {
        this.game.clearProjectilesOutside(this.borders);
      }
    }
  }
}
