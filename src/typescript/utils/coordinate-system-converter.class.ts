import { PointPolar } from '../models/geometry/point-polar.interface';
import { Point } from '../models/geometry/point.intarface';

const originDefault: Point = { x: 0, y: 0 };

export class CoordinateSystemConverter {
  public static toCartesian(point: PointPolar, origin = originDefault): Point {
    return {
      x: point.radius * Math.cos(point.radians) + origin.x,
      y: point.radius * Math.sin(point.radians) + origin.y,
    };
  }
}
