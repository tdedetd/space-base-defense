import { Rectangle } from '../models/geometry/rectangle.interface';
import { isPointInsideIntervals } from './is-point-inside-intervals';

export function isRectangleInsideRectangle(
  innerRectangle: Rectangle,
  outerRectangle: Rectangle
): boolean {
  const xMinOuter = outerRectangle.x;
  const xMaxOuter = outerRectangle.x + outerRectangle.width;
  const yMinOuter = outerRectangle.y;
  const yMaxOuter = outerRectangle.y + outerRectangle.height;
  return isPointInsideIntervals(
    { x: innerRectangle.x, y: innerRectangle.y },
    xMinOuter, xMaxOuter, yMinOuter, yMaxOuter
  ) && isPointInsideIntervals(
    { x: innerRectangle.x + innerRectangle.width, y: innerRectangle.y + innerRectangle.height },
    xMinOuter, xMaxOuter, yMinOuter, yMaxOuter
  );
}
