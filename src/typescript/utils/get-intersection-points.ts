import { checkIntersection } from 'line-intersect';
import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { Point } from '../models/geometry/point.intarface';

export function getIntersectionPoints(line: Line, rectangle: Rectangle): Point[] {
  const vertex1: Point = {
    x: rectangle.x,
    y: rectangle.y
  }
  const vertex2: Point = {
    x: rectangle.x + rectangle.width,
    y: rectangle.y
  };
  const vertex3: Point = {
    x: rectangle.x + rectangle.width,
    y: rectangle.y + rectangle.height
  };
  const vertex4: Point = {
    x: rectangle.x,
    y: rectangle.y + rectangle.height
  }
  const checkResults = [
    checkIntersection(
      line[0].x, line[0].y, line[1].x, line[1].y,
      vertex1.x, vertex1.y, vertex2.x, vertex2.y
    ),
    checkIntersection(
      line[0].x, line[0].y, line[1].x, line[1].y,
      vertex2.x, vertex2.y, vertex3.x, vertex3.y
    ),
    checkIntersection(
      line[0].x, line[0].y, line[1].x, line[1].y,
      vertex3.x, vertex3.y, vertex4.x, vertex4.y
    ),
    checkIntersection(
      line[0].x, line[0].y, line[1].x, line[1].y,
      vertex1.x, vertex1.y, vertex4.x, vertex4.y
    ),
  ];
  return checkResults.reduce<Point[]>((acc, current) => {
    return current.type === 'intersecting' ? [...acc, current.point] : acc;
  }, []);
}
