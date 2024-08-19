import { Line } from '../../models/geometry/line.type';
import { Point } from '../../models/geometry/point.intarface';
import { TimestampToNumberFunction } from '../../models/timestamp-to-number-function.type';

export interface ParticlesEmitOptions {
  color: string;
  count: number;
  spawnPosition: Point | Line;
  angle: number;
  angleAmplitude?: number;
  lifetime: number | [number, number];
  radius: number;
  speed: {
    average: number;
    deviation?: number;
  };
  opacity?: number | TimestampToNumberFunction;
}
