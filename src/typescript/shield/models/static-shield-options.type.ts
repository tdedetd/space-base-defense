import { Point } from '../../models/geometry/point.intarface';

export type StaticShieldOptions = (
  {
    xRadius: number;
    yRadius: number;
  } |
  {
    radius: number;
  }
) & {
  position: Point;
};
