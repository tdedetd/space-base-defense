import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { BlasterProjectile } from '../projectile/blaster-projectile';
import { BlasterProjectileCharacteristics } from '../projectile/models/blaster-projectile-characteristics.type';
import { Random } from '../utils/random';
import { toRadians } from '../utils/to-radians';
import { ProjectilesSpawnFrequencyFunction } from './models/projectiles-spawn-frequency-function';

export class EnemyProjectileSpawner {
  private readonly _frequency: number | ProjectilesSpawnFrequencyFunction;
  private _targets: Rectangle[];
  private borders: Rectangle | null = null;

  public get targets(): Rectangle[] {
    return this._targets;
  }

  /**
   * @param frequency projectiles per second
   */
  constructor(
    targets: Rectangle[],
    frequency: number | ProjectilesSpawnFrequencyFunction,
    private projectileOptions: BlasterProjectileCharacteristics,
  ) {
    this._frequency = frequency;
    this._targets = targets;
  }

  public getCurrentSpawnFrequency(msFromStart: number): number {
    return Math.max(
      typeof this._frequency === 'number' ? this._frequency : this._frequency(msFromStart),
      0
    );
  }

  public requestForSpawn(diffMs: number, msFromStart: number): BlasterProjectile[] | null {
    if (msFromStart < 0 || !this.borders) {
      return null;
    }

    const frequency = this.getCurrentSpawnFrequency(msFromStart);

    const msForOneProjectile = 1000 / frequency;
    let baseCount = Math.floor(diffMs / msForOneProjectile);

    if ((diffMs % msForOneProjectile) / msForOneProjectile > Math.random()) {
      baseCount++;
    }

    return baseCount ? Array(baseCount).fill(
      new BlasterProjectile({
        ...this.projectileOptions,
        origin: this.getTargetPosition(),
        position: {
          radians: toRadians(Random.interval(40, 140)),
          radius: 750
        },
        direction: 'toCenter',
      })
    ) : null;
  }

  public setBorders(borders: Rectangle): void {
    if (borders.width < 0 || borders.height < 0) {
      throw new Error(`Rectangle has negative sizes (${borders.width}; ${borders.height})`);
    }
    this.borders = borders;
  }

  private getTargetPosition(): Point {
    const target = this.targets[Random.integer(this.targets.length)];
    return {
      x: Random.interval(target.x, target.x + target.width),
      y: Random.interval(target.y, target.y + target.height)
    };
  }
}
