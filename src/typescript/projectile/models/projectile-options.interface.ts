import { PointPolar } from '../../models/geometry/point-polar.interface';
import { Point } from '../../models/geometry/point.intarface';
import { ProjectileDirection } from './projectile-direction.type';

export interface ProjectileOptions {
  color?: string;
  direction?: ProjectileDirection;
  origin: Point;
  speed: number;
  position: PointPolar;
}
