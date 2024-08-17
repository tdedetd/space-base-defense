import { PointPolar } from './geometry/point-polar.interface';
import { Point } from './geometry/point.intarface';
import { PolarDirection } from './polar-direction.type';

export interface SceneObjectOptions {
  color?: string;
  direction?: PolarDirection;
  origin: Point;
  speed: number;
  position: PointPolar;
}
