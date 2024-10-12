import { toRadians } from '../../utils/to-radians';
import { LevelOptions } from '../models/level-options.interface';

export const levelDefault: LevelOptions = {
  baseModules: [
    {
      x: 420,
      y: 20,
      width: 30,
      height: 16,
    },
    {
      x: 500,
      y: 30,
      width: 30,
      height: 18,
    },
    {
      x: 580,
      y: 26,
      width: 30,
      height: 16,
    }
  ],
  cannons: [
    {
      barrelLength: 30,
      rotationRadians: toRadians(45),
      position: { x: 100, y: 100 },
      reloadingMs: 500,
      projectileOptions: {
        speed: 1000,
        color: '#dd8eff',
        length: 50
      },
    },
    {
      barrelLength: 30,
      rotationRadians: toRadians(135),
      position: { x: 900, y: 100 },
      reloadingMs: 500,
      projectileOptions: {
        speed: 1000,
        color: '#dd8eff',
        length: 50
      },
    },
  ],
  enemyProjectile: {
    frequency: 1,
    options: {
      length: 100,
      speed: 100,
      color: 'rgb(0, 255, 0)'
    },
  },
  staticShields: [
    {
      position: { x: 500, y: -20 },
      xRadius: 500,
      yRadius: 220,
    }
  ],
};
