import { Line } from '../models/geometry/line.type';
import { PointPolar } from '../models/geometry/point-polar.interface';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { ProjectileDirection } from './models/projectile-direction.type';
import { ProjectileOptions } from './models/projectile-options.interface';

export abstract class Projectile {
  protected _color: string;
  protected _direction: ProjectileDirection;
  protected _origin: Point;
  protected _speed: number;
  protected _position: PointPolar;

  public get color(): string {
    return this._color;
  }

  public get direction(): ProjectileDirection {
    return this._direction;
  }

  public get origin(): Point {
    return this._origin;
  }

  public get speed(): number {
    return this._speed;
  }

  public get position(): PointPolar {
    return this._position;
  }

  constructor({
    color,
    direction,
    origin,
    position,
    speed,
  }: ProjectileOptions) {
    this._color = color ?? '#fff';
    this._direction = direction ?? 'fromCenter';
    this._origin = origin;
    this._speed = speed;
    this._position = position;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public intersects(figure: Line | Rectangle): boolean {
    throw new Error('Method is not implemented');
  }

  public move(ms: number): void {
    const distance = this._speed * (ms / 1000);

    switch (this._direction) {
      case 'fromCenter':
        this._position.radius += distance;
        break;
      case 'toCenter':
        this._position.radius -= distance;
        break;
      default:
        throw new Error(
          `this._direction has incorrect value: ${this._direction}`
        );
    }
  }
}
