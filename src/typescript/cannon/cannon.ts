import { Point } from '../models/geometry/point.intarface';
import { BlasterProjectile } from '../projectile/blaster-projectile';
import { BlasterProjectileCharacteristics } from '../projectile/models/blaster-projectile-characteristics.type';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { toRadians } from '../utils/to-radians';
import { FireWhileReloadingCannonError } from './errors/fire-while-reloading-cannon-error';
import { CannonOptions } from './models/cannon-options.interface';
import { ReloadingState } from './models/reloading-state.type';

export class Cannon {
  private _rotationRadians: number;
  private readonly _barrelLength: number;
  private readonly _position: Point;
  private readonly _projectileOptions: BlasterProjectileCharacteristics;
  private readonly _reloadingMs: number;
  private lastShotTimestamp = 0;

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
    reloadingMs
  }: CannonOptions) {
    this._position = position;
    this._rotationRadians = rotationRadians ?? toRadians(45);
    this._barrelLength = barrelLength;
    this._projectileOptions = projectileOptions;
    this._reloadingMs = reloadingMs;
  }

  public getReloadingState(timestamp: number): ReloadingState {
    if (this.lastShotTimestamp + this._reloadingMs > timestamp) {
      return {
        status: 'reloading',
        progress: (timestamp - this.lastShotTimestamp) / this._reloadingMs
      };
    } else {
      return { status: 'ready' };
    }
  }

  public setRotation(radians: number): void {
    this._rotationRadians = radians;
  }

  public tryToFire(timestamp: number): BlasterProjectile {
    if (this.getReloadingState(timestamp).status === 'reloading') {
      throw new FireWhileReloadingCannonError();
    }

    this.lastShotTimestamp = timestamp;
    return new BlasterProjectile({
      ...this._projectileOptions,
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
}
