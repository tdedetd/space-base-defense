import { Point } from '../models/geometry/point.intarface';

export function getRandomPointBetween(point1: Point, point2: Point): Point {
  const coef = Math.random();
  return {
    x: (point2.x - point1.x) * coef + point1.x,
    y: (point2.y - point1.y) * coef + point1.y,
  };
}
