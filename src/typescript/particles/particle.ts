import { PointPolar } from '../models/geometry/point-polar.interface';
import { Point } from '../models/geometry/point.intarface';
import { ParticleOptions } from './models/particle-options.interface';

export class Particle {
  // radius
  // lifetime
  // age
  // opacity: number | (ms) => number

  protected _color: string;
  protected _speed: number;
  protected _origin: Point;
  protected _position: PointPolar;

  constructor(options: ParticleOptions) {

  }

  public update(ms: number): void {

  }
}
