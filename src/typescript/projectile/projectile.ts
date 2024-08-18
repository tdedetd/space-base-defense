import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { SceneObject } from '../scene-object';

export abstract class Projectile extends SceneObject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public intersects(figure: Line | Rectangle): boolean {
    throw new Error('Method is not implemented');
  }
}
