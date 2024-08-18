import { Point } from '../models/geometry/point.intarface';
import { TimestampToNumberFunction } from '../models/timestamp-to-number-function.type';
import { SceneObject } from '../scene-object';
import { CoordinateSystemConverter } from '../utils/coordinate-system-converter.class';
import { ParticleOptions } from './models/particle-options.interface';

export class Particle extends SceneObject {
  private readonly _radius: number;
  private readonly lifetime: number;
  private readonly _opacity: number | TimestampToNumberFunction;

  public get radius(): number {
    return this._radius;
  }

  constructor(options: ParticleOptions) {
    super(options);
    const { radius, lifetime, opacity } = options;
    this._radius = radius;
    this.lifetime = lifetime;
    this._opacity = opacity ?? 1;
  }

  public getPosition(): Point {
    return CoordinateSystemConverter.toCartesian(this.position, this.origin);
  }

  public getOpacity(): number {
    return typeof this._opacity === 'number' ? this._opacity : this._opacity(this.age);
  }

  public isDead(): boolean {
    return this.age > this.lifetime;
  }
}
