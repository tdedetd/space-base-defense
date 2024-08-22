import { CoordinateSystemConverter } from '../../utils/coordinate-system-converter.class';
import { toRadians } from '../../utils/to-radians';
import { LevelOptions } from '../models/level-options.interface';

const cannonsCount = 100;

export const levelCircle: LevelOptions = {
  cannons: Array(cannonsCount).fill(null).map((_, i) => ({
    barrelLength: 0,
    rotationRadians: toRadians(135),
    position: CoordinateSystemConverter.toCartesian({
      radians: toRadians(360 / cannonsCount * i),
      radius: 300,
    }, { x: 500, y: 375 }),
    reloadingMs: 0,
    projectileOptions: {
      speed: 1000,
      color: 'rgb(255, 255, 100)',
      length: 10
    },
  })),
  enemyProjectile: {
    frequency: 0,
    options: {
      length: 100,
      speed: 100,
      color: 'rgb(0, 255, 0)'
    },
  },
};
