import { PointPolar } from './geometry/point-polar.interface';
import { Point } from './geometry/point.intarface';
import { ProjectileDirection } from './projectile-direction.type';

export interface ProjectileOptions {
  color?: string;
  direction?: ProjectileDirection;
  speed: number;
  targetPosition: Point;
  position: PointPolar;
}
