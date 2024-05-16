import { Rectangle } from '../models/geometry/rectangle.interface';
import { formatPoint } from './format-point';

export function formatRectangle(rectangle: Rectangle, fractionDigits = 0): string {
  return `[${formatPoint({
    x: rectangle.x, y: rectangle.y
  }, fractionDigits)}, ${formatPoint({
    x: rectangle.x + rectangle.width,
    y: rectangle.y + rectangle.height
  })}]`;
}
