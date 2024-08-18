import { SceneObjectOptions } from '../../models/scene-object-options.interface';
import { TimestampToNumberFunction } from '../../models/timestamp-to-number-function.type';

export interface ParticleOptions extends SceneObjectOptions {
  radius: number;
  lifetime: number;
  opacity?: number | TimestampToNumberFunction;
}
