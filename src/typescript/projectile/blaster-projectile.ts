import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
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
        radius: point2Radius >= 0 ? point2Radius : 0,
      }, this._origin)
    ];
  }

  public intersects(hitBox: Rectangle): boolean {
    return false;
  }
}
