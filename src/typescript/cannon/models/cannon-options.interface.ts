import { Point } from '../../models/geometry/point.intarface';
import { BlasterProjectileOptions } from '../../projectile/models/blaster-projectile-options.interface';

export interface CannonOptions {
  barrelLength: number;
  position: Point;
  projectileOptions: Pick<BlasterProjectileOptions, 'color' | 'speed' | 'length'>;
  reloadingTimeMs: number;
  rotationRadians?: number
}
