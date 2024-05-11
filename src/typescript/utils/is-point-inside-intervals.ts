import { Point } from '../models/geometry/point.intarface';

export function isPointInsideIntervals(
  point: Point,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): boolean {
  return point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax;
}
