import { checkIntersection } from 'line-intersect';
import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { isPointInsideIntervals } from '../utils/is-point-inside-intervals';
import { isRectangle } from '../utils/typeguards/is-rectangle';
import { BlasterProjectileOptions } from './models/blaster-projectile-options.interface';
import { Projectile } from './projectile';

export class BlasterProjectile extends Projectile {
  private _length: number;

  public get length(): number {
    return this._length;
  }

  constructor(options: BlasterProjectileOptions) {
    super(options);
    this._length = options.length;
  }

  public getLine(): Line {
    const point2Radius = this._position.radius + (
      this._direction === 'fromCenter' ? -this._length : this._length
    );

    return [
      CoordinateSystemConverter.toCartesian(this._position, this._origin),
      CoordinateSystemConverter.toCartesian({
        radians: this._position.radians,
        radius: this._direction === 'toCenter' || point2Radius >= 0 ? point2Radius : 0,
      }, this._origin)
    ];
  }

  public intersects(figure: Line | Rectangle): boolean {
    return isRectangle(figure)
      ? this.intersectsRectangle(figure)
      : this.intersectsLine(figure);
  }

  private intersectsLine(line: Line): boolean {
    const projectileLine = this.getLine();
    return checkIntersection(
      line[0].x, line[0].y, line[1].x, line[1].y,
      projectileLine[0].x, projectileLine[0].y, projectileLine[1].x, projectileLine[1].y
    ).type === 'intersecting';
  }

  private intersectsRectangle(rectangle: Rectangle): boolean {
    const line = this.getLine();
    const xMin = rectangle.x;
    const yMin = rectangle.y;
    const xMax = rectangle.x + rectangle.width;
    const yMax = rectangle.y + rectangle.height;

    return isPointInsideIntervals(line[0], xMin, xMax, yMin, yMax)
      || isPointInsideIntervals(line[0], xMin, xMax, yMin, yMax);
  }
}
