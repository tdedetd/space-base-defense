import { PointPolar } from '../models/geometry/point-polar.interface';
import { Point } from '../models/geometry/point.intarface';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { ProjectileDirection } from '../models/projectile-direction.type';
import { ProjectileOptions } from '../models/projectile-options.interface';

export abstract class Projectile {
  protected _color: string;
  protected _direction: ProjectileDirection;
  protected _speed: number;
  protected _targetPosition: Point;
  protected _position: PointPolar;

  public get color(): string {
    return this._color;
  }

  public get direction(): ProjectileDirection {
    return this._direction;
  }

  public get speed(): number {
    return this._speed;
  }

  public get targetPosition(): Point {
    return this._targetPosition;
  }

  public get position(): PointPolar {
    return this._position;
  }

  constructor({
    color,
    direction,
    position,
    speed,
    targetPosition,
  }: ProjectileOptions) {
    this._color = color ?? '#fff';
    this._direction = direction ?? 'fromCenter';
    this._speed = speed;
    this._targetPosition = targetPosition;
    this._position = position;
  }

  public intersects(hitBox: Rectangle): boolean {
    throw new Error('Method is not implemented');
  }

  public move(ms: number): void {
    const distance = this._speed * (ms / 1000);

    switch (this._direction) {
      case 'fromCenter':
        this._position.length += distance;
        break;
      case 'toCenter':
        this._position.length -= distance;
        break;
    }
  }
}
