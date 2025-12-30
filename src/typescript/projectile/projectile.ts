import { Line } from '../models/geometry/line.type';
import { Rectangle } from '../models/geometry/rectangle.interface';
import { SceneObject } from '../scene-object';

export abstract class Projectile extends SceneObject {
  public abstract intersects(figure: Line | Rectangle): boolean;
}
