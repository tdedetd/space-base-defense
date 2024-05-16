import { Line } from '../../models/geometry/line.type';
import { Rectangle } from '../../models/geometry/rectangle.interface';

export function isRectangle(figure: Line | Rectangle): figure is Rectangle {
  return 'x' in figure && 'y' in figure && 'width' in figure && 'height' in figure;
}
