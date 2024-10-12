import { Line } from '../models/geometry/line.type';
import { Point } from '../models/geometry/point.intarface';
import { getQuadraticEquationSolution } from '../utils/get-quadratic-equation-solution';
import { StaticShieldOptions } from './models/static-shield-options.type';

export class StaticShield {
  private readonly _xRadius: number;
  private readonly _yRadius: number;
  private readonly _position: Point;

  public get xRadius(): number {
    return this._xRadius;
  }

  public get yRadius(): number {
    return this._yRadius;
  }

  public get position(): Point {
    return this._position;
  }

  constructor(options: StaticShieldOptions) {
    if ('radius' in options) {
      this._xRadius = options.radius;
      this._yRadius = options.radius;
    } else {
      this._xRadius = options.xRadius;
      this._yRadius = options.yRadius;
    }

    this._position = options.position;
  }

  public getIntersectionPoints(line: Line): Point[] {
    if (this.xRadius === 0 || this.yRadius === 0 || line[0].x === line[1].x && line[0].y === line[1].y) {
      return [];
    }

    const rx = this.xRadius < 0 ? this.xRadius : -this.xRadius;
    const ry = this.yRadius < 0 ? this.yRadius : -this.yRadius;
    const x0 = line[0].x - this.position.x;
    const y0 = line[0].y - this.position.y;
    const x1 = line[1].x - this.position.x;
    const y1 = line[1].y - this.position.y;

    const a = ((x1 - x0) * (x1 - x0)) / rx / rx + ((y1 - y0) * (y1 - y0)) / ry / ry;
    const b = (2 * x0 * (x1 - x0)) / rx / rx + (2 * y0 * (y1 - y0)) / ry / ry;
    const c = (x0 * x0) / rx / rx + (y0 * y0) / ry / ry - 1;

    return getQuadraticEquationSolution(a, b, c)
      .filter(t => t >= 0 && t <= 1)
      .map(v => ({
        x: x0 + (x1 - x0) * v + this.position.x,
        y: y0 + (y1 - y0) * v + this.position.y,
      }));
  }
}
