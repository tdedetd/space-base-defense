import { BlasterProjectile } from '../../projectile/blaster-projectile';

export type GameEventParams = {
  blasterProjectilesIntersect: {
    projectiles: BlasterProjectile[],
  },
  destroyModule: undefined,
};
