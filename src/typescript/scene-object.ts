import { PointPolar } from './models/geometry/point-polar.interface';
import { Point } from './models/geometry/point.intarface';
import { PolarDirection } from './models/polar-direction.type';
import { SceneObjectOptions } from './models/scene-object-options.interface';

export abstract class SceneObject {
  protected _color: string;
  protected _direction: PolarDirection
  protected _origin: Point;
  protected _speed: number;
  protected _position: PointPolar;

  public get color(): string {
    return this._color;
  }

  public get direction(): PolarDirection {
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
  }: SceneObjectOptions) {
    this._color = color ?? '#fff';
    this._direction = direction ?? 'fromCenter';
    this._origin = origin;
    this._speed = speed;
    this._position = position;
  }
}
