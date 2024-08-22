import { toRadians } from '../../utils/to-radians';
import { LevelOptions } from '../models/level-options.interface';

const cannonsCount = 20;

export const levelSlow: LevelOptions = {
  cannons: Array(cannonsCount).fill(null).map((_, i) => {
    const colorChanel = (i % (cannonsCount / 2)) / (cannonsCount / 2) * 200;
    return {
      barrelLength: 10,
      rotationRadians: toRadians(90),
      position: {
        x: i < cannonsCount / 2 ? 0 : 1000,
        y: 50 + (750 / (cannonsCount / 2)) * (i % (cannonsCount / 2)),
      },
      reloadingMs: 500,
      projectileOptions: {
        speed: 100,
        color: `rgb(${255 - colorChanel}, ${255 - colorChanel}, ${colorChanel})`,
        length: 50
      },
    };
  }),
  enemyProjectile: {
    frequency: (ms) => ms % 2000 < 100 ? 250 : 0,
    options: {
      length: 100,
      speed: 100,
      color: 'rgb(0, 255, 0)'
    },
  },
};
