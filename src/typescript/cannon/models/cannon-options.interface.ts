import { Point } from '../../models/geometry/point.intarface';
import { BlasterProjectileCharacteristics } from '../../projectile/models/blaster-projectile-characteristics.type';

export interface CannonOptions {
  barrelLength: number;
  position: Point;
  projectileOptions: BlasterProjectileCharacteristics;
  reloadingMs: number;
  rotationRadians?: number
}
