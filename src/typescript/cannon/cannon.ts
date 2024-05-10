import { Point } from '../models/geometry/point.intarface';
import { BlasterProjectile } from '../projectile/blaster-projectile';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { toRadians } from '../utils/to-radians';
import { CannonOptions } from './models/cannon-options.interface';

export class Cannon {
  private _rotationRadians: number;
  private readonly _barrelLength: number;
  private readonly _position: Point;
  private readonly _projectileOptions: CannonOptions['projectileOptions'];
  private readonly _reloadingTimeMs: number;

  public get barrelLength(): number {
    return this._barrelLength;
  }

  public get position(): Point {
    return this._position;
  }

  public get rotationRadians(): number {
    return this._rotationRadians;
  }

  constructor({
    rotationRadians,
    barrelLength,
    position,
    projectileOptions,
    reloadingTimeMs
  }: CannonOptions) {
    this._position = position;
    this._rotationRadians = toRadians(rotationRadians ?? 45);
    this._barrelLength = barrelLength;
    this._projectileOptions = projectileOptions;
    this._reloadingTimeMs = reloadingTimeMs;
  }

  public fire(): BlasterProjectile {
    return new BlasterProjectile({
      length: this._projectileOptions.length,
      speed: this._projectileOptions.speed,
      color: this._projectileOptions.color,
      direction: 'fromCenter',
      position: { radius: 0, radians: this._rotationRadians },
      origin: CoordinateSystemConverter.toCartesian(
        {
          radius: this._barrelLength,
          radians: this._rotationRadians
        },
        this._position
      ),
    });
  }

  public setRotation(radians: number): void {
    this._rotationRadians = radians;
  }
}
