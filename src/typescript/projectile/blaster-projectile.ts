import { Rectangle } from '../models/geometry/rectangle.interface';
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

  public intersects(hitBox: Rectangle): boolean {
    return false;
  }
}
