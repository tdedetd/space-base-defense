import { Point } from '../../models/geometry/point.intarface';

export interface Camera {
  position: Point;
  zoom: number;
}
