import { PointPolar } from './models/geometry/point-polar.interface';
import { Point } from './models/geometry/point.intarface';
import { PolarDirection } from './models/polar-direction.type';
import { SceneObjectOptions } from './models/scene-object-options.interface';
import { TimestampToNumberFunction } from './models/timestamp-to-number-function.type';

export abstract class SceneObject {
  protected _color: string;
  protected _direction: PolarDirection
  protected _origin: Point;
  protected _speed: number | TimestampToNumberFunction;
  protected _position: PointPolar;

  protected age = 0;

  public get color(): string {
    return this._color;
  }

  public get direction(): PolarDirection {
    return this._direction;
  }

  public get origin(): Point {
    return this._origin;
  }

  public get speed(): number | TimestampToNumberFunction {
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
  }: SceneObjectOptions) {
    this._color = color ?? '#fff';
    this._direction = direction ?? 'fromCenter';
    this._origin = origin;
    this._speed = speed;
    this._position = position;
  }

  public move(ms: number): void {
    this.age += ms;
    const distance = this.getSpeed() * (ms / 1000);

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

  private getSpeed(): number {
    return typeof this.speed === 'number' ? this.speed : this.speed(this.age);
  }
}
