import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { SceneObject } from '../scene-object';

export abstract class Projectile extends SceneObject {
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
