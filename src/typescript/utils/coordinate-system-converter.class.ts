import { PointPolar } from '../models/geometry/point-polar.interface';
import { Point } from '../models/geometry/point.intarface';
import { getDistance } from './get-distance';

const originDefault: Point = { x: 0, y: 0 };

export class CoordinateSystemConverter {
  public static toCartesian(point: PointPolar, origin = originDefault): Point {
    return {
      x: point.radius * Math.cos(point.radians) + origin.x,
      y: point.radius * Math.sin(point.radians) + origin.y,
    };
  }

  public static toPolar(point: Point, origin = originDefault): PointPolar {
    const innerPoint: Point = {
      x: point.x - origin.x,
      y: point.y - origin.y,
    };

    const radius = getDistance(point, origin);
    const radians =
      innerPoint.x === 0
        ? innerPoint.y > 0
          ? Math.PI / 2
          : innerPoint.y < 0
          ? Math.PI * 3 / 2
          : 0
      : innerPoint.x > 0
        ? innerPoint.y >= 0
          ? Math.atan(innerPoint.y / innerPoint.x)
          : Math.atan(innerPoint.y / innerPoint.x) + Math.PI * 2
      : Math.atan(innerPoint.y / innerPoint.x) + Math.PI;

    return { radians, radius };
  }
}
