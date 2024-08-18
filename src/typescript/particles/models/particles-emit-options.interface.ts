import { Point } from '../../models/geometry/point.intarface';

export interface ParticlesEmitOptions {
  color: string;
  count: number;
  position: Point;
  angle: number;
  angleAmplitude?: number;
  lifetime: number | [number, number];
  radius: number;
  speed: {
    average: number;
    deviation?: number;
  }
}
