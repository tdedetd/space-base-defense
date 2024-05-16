import { NoIntersectionPointsError } from './errors/no-intersection-points-error';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { BlasterProjectile } from '../projectile/blaster-projectile';
import { BlasterProjectileCharacteristics } from '../projectile/models/blaster-projectile-characteristics.type';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { getDistance } from '../utils/get-distance';
import { getIntersectionPoints } from '../utils/get-intersection-points';
import { Random } from '../utils/random';
import { removeElementFromArray } from '../utils/remove-element-from-array';
import { toRadians } from '../utils/to-radians';
import { ProjectilesSpawnFrequencyFunction } from './models/projectiles-spawn-frequency-function';
import { isRectangleInsideRectangle } from '../utils/is-rectangle-inside-rectangle';
import { formatRectangle } from '../utils/format-rectangle';

export class EnemyProjectileSpawner {
  private readonly _frequency: number | ProjectilesSpawnFrequencyFunction;
  private _borders: Rectangle | null = null;
  private _targets: Rectangle[];

  public get borders(): Rectangle | null {
    return this._borders;
  }

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

  public getCurrentSpawnFrequency(timestamp: number): number {
    return Math.max(
      typeof this._frequency === 'number' ? this._frequency : this._frequency(timestamp),
      0
    );
  }

  public requestForSpawn(diffMs: number, timestamp: number): BlasterProjectile[] {
    if (timestamp < 0 || !this._borders) {
      return [];
    }

    const frequency = this.getCurrentSpawnFrequency(timestamp);

    const msForOneProjectile = 1000 / frequency;
    let count = Math.floor(diffMs / msForOneProjectile);

    if ((diffMs % msForOneProjectile) / msForOneProjectile > Math.random()) {
      count++;
    }

    const projectiles: BlasterProjectile[] = [];
    for (let i = 0; i < count; i++) {
      try {
        projectiles.push(this.generateProjectile());
      } catch (error) {
        if (!(error instanceof Error && error.name === 'NoIntersectionPointsError')) {
          throw error;
        }
      }
    }

    return projectiles;
  }

  public removeTarget(target: Rectangle): void {
    this._targets = removeElementFromArray(this._targets, target);
  }

  public setBorders(borders: Rectangle): void {
    if (borders.width < 0 || borders.height < 0) {
      throw new Error(`rectangle has negative sizes (${borders.width}; ${borders.height})`);
    }

    this.targets.forEach((target) => {
      if (!isRectangleInsideRectangle(target, borders)) {
        throw new Error(`target is not inside spawn borders. Target: ${formatRectangle(
          target, 3
        )}`);
      }
    });

    this._borders = borders;
  }

  private generateProjectile(): BlasterProjectile {
    if (!this.borders) {
      throw new Error('no borders');
    }

    const origin = this.getTargetPosition();
    const diagonal = getDistance({ x: 0, y: 0 }, { x: this.borders.width, y: this.borders.height });
    const angle = toRadians(Random.interval(45, 145));

    const pointsOnBorders = getIntersectionPoints(
      [
        origin,
        CoordinateSystemConverter.toCartesian({
          radians: angle, radius: diagonal
        }, origin)
      ],
      this.borders
    );
    if (pointsOnBorders.length === 0) {
      throw new NoIntersectionPointsError('no intersection points');
    }

    return new BlasterProjectile({
      ...this.projectileOptions,
      origin,
      position: {
        radians: angle,
        radius: CoordinateSystemConverter.toPolar(pointsOnBorders[0], origin).radius
      },
      direction: 'toCenter',
    });
  }

  private getTargetPosition(): Point {
    if (this.targets.length) {
      const target = this.targets[Random.integer(this.targets.length)];
      return {
        x: Random.interval(target.x, target.x + target.width),
        y: Random.interval(target.y, target.y + target.height)
      };
    } else if (this._borders) {
      return {
        x: Random.interval(this._borders.x, this._borders.x + this._borders.width),
        y: this._borders.y + 1
      }
    } else {
      return { x: 0, y: 0 };
    }
  }
}
