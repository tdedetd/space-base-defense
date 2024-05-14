import { Point } from '../models/geometry/point.intarface';

export function formatPoint(point: Point, fractionDigits = 0): string {
  return `(${point.x.toFixed(fractionDigits)}; ${point.y.toFixed(fractionDigits)})`;
}
